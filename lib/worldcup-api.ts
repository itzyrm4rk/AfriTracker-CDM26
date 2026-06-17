// Client pour l'API https://worldcup26.ir
// Endpoints: GET /get/games, /get/groups, /get/teams, /get/stadiums

import { Match, Group, Team, Standing, Stadium, MatchStatus } from "@/types"
import { ALL_TEAMS, AFRICAN_CODES, getTeamByApiId, getTeamByCode, TeamData } from "@/data/teams"

const BASE_URL = process.env.WORLDCUP_API_BASE || "https://worldcup26.ir"
const TOKEN = process.env.WORLDCUP_API_TOKEN || ""

// ─── Helpers ────────────────────────────────────────────────────────────────

function getAuthHeaders(): HeadersInit {
  return TOKEN
    ? { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" }
}

/** Construit un objet Team de notre format à partir d'un TeamData */
function buildTeamFromData(localTeam: TeamData): Team {
  return {
    id: localTeam.id,
    apiId: localTeam.apiId,
    name: localTeam.name,
    code: localTeam.code,
    flag: localTeam.flag,
    flagUrl: localTeam.flagUrl,
    group: localTeam.group,
    isAfrican: localTeam.isAfrican,
    isEliminated: localTeam.isEliminated,
    eliminatedAt: localTeam.eliminatedAt,
  }
}

/** Fallback en cas d'équipe inconnue */
function buildUnknownTeam(idOrName: string): Team {
  return {
    id: idOrName,
    name: `Unknown (${idOrName})`,
    code: "UNK",
    flag: "🏳️",
    group: "?",
    isAfrican: false,
    isEliminated: false,
  }
}

/** Mappe le statut de l'API vers notre MatchStatus */
function mapStatus(finished: string, timeElapsed: string): MatchStatus {
  if (finished === "TRUE") return "finished"

  const elapsed = (timeElapsed || "").toLowerCase()
  if (elapsed === "notstarted") return "scheduled"
  if (elapsed === "finished") return "finished"
  if (elapsed === "postponed" || elapsed === "cancelled") return "postponed"

  // S'il y a un temps écoulé (ex: "45", "HT", "90+2"), c'est en cours
  return "live"
}

// ─── Fetch principal ─────────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: getAuthHeaders(),
      next: { revalidate: 60 }, // cache 60s
    })

    if (!res.ok) {
      console.error(`WorldCup API error ${res.status} for ${path}`)
      return null
    }

    const json = await res.json()
    return json as T
  } catch (err) {
    console.error(`WorldCup API fetch error for ${path}:`, err)
    return null
  }
}

// ─── Stadiums (Cache simple) ─────────────────────────────────────────────────

// On pourrait cacher ça, mais on va juste les fetch au besoin ou les intégrer
let cachedStadiums: Record<string, Stadium> | null = null

export async function fetchStadiumsMap(): Promise<Record<string, Stadium>> {
  if (cachedStadiums) return cachedStadiums

  const res = await apiFetch<{ stadiums: any[] }>("/get/stadiums")
  if (!res || !res.stadiums) return {}

  const map: Record<string, Stadium> = {}
  res.stadiums.forEach(s => {
    map[s.id] = {
      name: s.name_en || s.fifa_name || "Unknown Stadium",
      city: s.city_en || "",
      country: s.country_en || "",
      countryFlag: s.country_en === "Mexico" ? "🇲🇽" : s.country_en === "Canada" ? "🇨🇦" : "🇺🇸",
      capacity: s.capacity || 0
    }
  })

  cachedStadiums = map
  return map
}

// ─── Auth (pour obtenir un token JWT) ───────────────────────────────────────

export async function registerAndGetToken(email: string, password: string, name: string): Promise<string | null> {
  try {
    // Essai login d'abord
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (loginRes.ok) {
      const data = await loginRes.json()
      return data.token || null
    }

    // Si login échoue, on s'enregistre
    const registerRes = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    if (registerRes.ok) {
      const data = await registerRes.json()
      return data.token || null
    }

    return null
  } catch {
    return null
  }
}

// ─── Teams ───────────────────────────────────────────────────────────────────

export async function fetchAllAPITeams(): Promise<Team[]> {
  const res = await apiFetch<{ teams: any[] }>("/get/teams")
  if (!res || !res.teams) return buildFallbackTeams()

  // On retourne simplement notre liste locale mappée, car on a déjà géré
  // les bonnes associations de groupes et d'identifiants dans data/teams.ts
  return ALL_TEAMS.map(buildTeamFromData)
}

function buildFallbackTeams(): Team[] {
  return ALL_TEAMS.map(buildTeamFromData)
}

// ─── Matches ─────────────────────────────────────────────────────────────────

export async function fetchAllMatches(): Promise<Match[]> {
  const [gamesRes, stadiumsMap] = await Promise.all([
    apiFetch<{ games: any[] }>("/get/games"),
    fetchStadiumsMap()
  ])

  let games = gamesRes?.games

  // FALLBACK LOGIC : Graceful Degradation
  if (!games) {
    console.warn("⚠️ WorldCup API indisponible. Utilisation du calendrier de secours (Fallback).")
    try {
      const fallbackData = require("@/data/fallback-games.json")
      games = fallbackData.games
    } catch (e) {
      console.error("Impossible de charger le fallback des matchs", e)
      return []
    }
  }

  if (!games) return []

  return games.map((g: any) => mapRawGame(g, stadiumsMap)).filter(Boolean) as Match[]
}

export async function fetchMatchesByDate(date: string): Promise<Match[]> {
  const all = await fetchAllMatches()
  return all.filter(m => m.date.startsWith(date))
}

export async function fetchLiveMatches(): Promise<Match[]> {
  const all = await fetchAllMatches()
  return all.filter(m => m.status === "live")
}

function parseScore(scoreStr: string | null | undefined): number | null {
  if (scoreStr === null || scoreStr === undefined || scoreStr === "null") return null
  const num = parseInt(scoreStr, 10)
  return isNaN(num) ? null : num
}

function parseDateUTC(dateStr: string, stadiumId: string, stadiumsMap: Record<string, Stadium>): string {
  // L'API renvoie la date locale du stade: "06/13/2026 21:00"
  if (!dateStr) return new Date().toISOString()
  try {
    const [datePart, timePart] = dateStr.split(' ')
    const [month, day, year] = datePart.split('/')
    const [hours, minutes] = timePart.split(':')

    // Déterminer le fuseau horaire en fonction de la région du stade
    let offsetHours = -4; // Par défaut EDT (Eastern Daylight Time)
    const rawStadium = stadiumsMap[stadiumId] as any; // Cast car on a besoin de la region brute 

    // Les IDs de stades (1 à 16)
    const id = parseInt(stadiumId);
    if (id >= 13 && id <= 16) {
      // Western (Vancouver, Seattle, SF, LA) -> PDT (UTC-7)
      offsetHours = -7;
    } else if (id >= 1 && id <= 3) {
      // Mexico Central (Mexico City, Guadalajara, Monterrey) -> CST (UTC-6)
      // Note: Le Mexique n'applique plus l'heure d'été
      offsetHours = -6;
    } else if (id >= 4 && id <= 6) {
      // US Central (Dallas, Houston, KC) -> CDT (UTC-5)
      offsetHours = -5;
    } else if (id >= 7 && id <= 12) {
      // Eastern (Atlanta, Miami, Boston, Philly, NY, Toronto) -> EDT (UTC-4)
      offsetHours = -4;
    }

    // Créer la date UTC en compensant le fuseau du stade
    // Ex: s'il est 21h au stade à UTC-4, l'heure UTC absolue est 21h - (-4) = 01h le lendemain
    const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours) - offsetHours, parseInt(minutes)))
    return date.toISOString()
  } catch {
    return new Date().toISOString()
  }
}

function mapRawGame(g: any, stadiumsMap: Record<string, Stadium>): Match | null {
  try {
    // Si l'équipe est "0", c'est un match TBD (ex: "Winner Match 86")
    let homeTeam: Team
    let awayTeam: Team

    if (g.home_team_id === "0") {
      homeTeam = buildUnknownTeam(g.home_team_label || "TBD")
    } else {
      const localHome = getTeamByApiId(g.home_team_id)
      homeTeam = localHome ? buildTeamFromData(localHome) : buildUnknownTeam(g.home_team_name_en)
    }

    if (g.away_team_id === "0") {
      awayTeam = buildUnknownTeam(g.away_team_label || "TBD")
    } else {
      const localAway = getTeamByApiId(g.away_team_id)
      awayTeam = localAway ? buildTeamFromData(localAway) : buildUnknownTeam(g.away_team_name_en)
    }

    const stadium = stadiumsMap[g.stadium_id] || buildStadium({ name: "Unknown Stadium" })

    const status = mapStatus(g.finished, g.time_elapsed)
    const phase = mapPhase(g.type || "group", g.group || "")

    let minute = null
    if (status === "live" && g.time_elapsed !== "notstarted" && g.time_elapsed !== "finished") {
      const parsed = parseInt(g.time_elapsed)
      if (!isNaN(parsed)) minute = parsed
    }

    return {
      id: parseInt(g.id) || Math.random(),
      homeTeam,
      awayTeam,
      homeScore: parseScore(g.home_score),
      awayScore: parseScore(g.away_score),
      date: parseDateUTC(g.local_date, g.stadium_id, stadiumsMap),
      stadium,
      phase,
      status,
      minute,
      events: [], // L'API donne scorers sous forme de chaîne, on pourrait le parser plus tard
    }
  } catch (e) {
    console.error("Erreur mapping game", e, g)
    return null
  }
}

function buildStadium(raw: { name?: string; city?: string; country?: string; capacity?: number }): Stadium {
  return {
    name: raw.name || "Stade inconnu",
    city: raw.city || "",
    country: raw.country || "",
    countryFlag: "🏳️",
    capacity: raw.capacity || 0,
  }
}

function mapPhase(type: string, groupRaw: string): string {
  const t = type.toLowerCase()
  if (t === "final") return "Finale"
  if (t === "third") return "Petite Finale"
  if (t === "sf") return "Demi-finales"
  if (t === "qf") return "Quarts de Finale"
  if (t === "r16") return "1/16 de Finale" // 16 équipes restantes -> Huitièmes
  if (t === "r32") return "1/32 de Finale" // 32 équipes restantes -> Seizièmes

  if (t === "group" || groupRaw) {
    return `Groupe ${groupRaw.replace("Group", "").trim().toUpperCase()}`
  }
  return "Inconnu"
}

// ─── Standings ────────────────────────────────────────────────────────────────

export async function fetchStandings(): Promise<Group[]> {
  const res = await apiFetch<{ groups: any[] }>("/get/groups")
  if (!res || !res.groups) return buildFallbackStandings()

  return res.groups.map(g => mapRawGroup(g)).filter(Boolean) as Group[]
}

function mapRawGroup(g: any): Group | null {
  try {
    const name = g.name || "?"
    const teams: Standing[] = (g.teams || []).map((s: any, i: number) => {

      const localData = getTeamByApiId(s.team_id)
      const team = localData ? buildTeamFromData(localData) : buildUnknownTeam(s.team_id)

      return {
        team,
        played: parseInt(s.mp) || 0,
        won: parseInt(s.w) || 0,
        drawn: parseInt(s.d) || 0,
        lost: parseInt(s.l) || 0,
        goalsFor: parseInt(s.gf) || 0,
        goalsAgainst: parseInt(s.ga) || 0,
        goalDifference: parseInt(s.gd) || 0,
        points: parseInt(s.pts) || 0,
        position: i + 1, // Will be resorted
      } as Standing
    })

    // L'API renvoie les équipes souvent dans le bon ordre, mais on retrie par sécurité
    teams.sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor)
    teams.forEach((t, i) => t.position = i + 1)

    return { name, teams }
  } catch {
    return null
  }
}

function buildFallbackStandings(): Group[] {
  // Groupes de secours basés sur nos données statiques
  const groups: Record<string, Group> = {}

  ALL_TEAMS.forEach(t => {
    if (!groups[t.group]) {
      groups[t.group] = { name: t.group, teams: [] }
    }
    groups[t.group].teams.push({
      team: buildTeamFromData(t),
      played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, goalDifference: 0,
      points: 0, position: groups[t.group].teams.length + 1,
    })
  })

  return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name))
}
