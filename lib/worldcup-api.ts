// Client pour l'API https://wcup2026.org/api/data.php
// Endpoints: ?action=all, ?action=live, ?action=standings, ?action=match&id=X

import { Match, MatchStat, Group, Team, Standing, Stadium, MatchStatus, MatchEvent } from "@/types"
import { ALL_TEAMS, getTeamByName, getTeamByApiId, TeamData } from "@/data/teams"

const BASE_URL = process.env.WORLDCUP_API_BASE || "https://wcup2026.org/api/data.php"

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Construit un objet Team de notre format à partir d'un TeamData */
function buildTeamFromData(localTeam: TeamData, eliminatedCodes?: Set<string>): Team {
  return {
    id: localTeam.id,
    apiId: localTeam.apiId,
    name: localTeam.name,
    code: localTeam.code,
    flag: localTeam.flag,
    flagUrl: localTeam.flagUrl,
    group: localTeam.group,
    isAfrican: localTeam.isAfrican,
    isEliminated: eliminatedCodes ? eliminatedCodes.has(localTeam.code) : localTeam.isEliminated,
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

function mapStatus(statusRaw: string): MatchStatus {
  const s = (statusRaw || "").toLowerCase()
  if (s === "finished") return "finished"
  if (s === "live" || s === "in-play" || s === "playing") return "live"
  if (s === "postponed" || s === "cancelled") return "postponed"
  return "scheduled"
}

/** Calcule dynamiquement les équipes éliminées à partir des matchs */
export function computeEliminatedTeams(matches: Match[]): Set<string> {
  const eliminated = new Set<string>()
  const koMatches = matches.filter(m => m.phase !== "Phase de groupes" && !m.phase.startsWith("Groupe"))

  // 1. Phase de groupes : Si on connait les 32 qualifiés, on élimine les autres
  const koParticipants = new Set<string>()
  koMatches.forEach(m => {
    if (m.homeTeam.code !== "UNK") koParticipants.add(m.homeTeam.code)
    if (m.awayTeam.code !== "UNK") koParticipants.add(m.awayTeam.code)
  })
  if (koParticipants.size >= 32) {
    ALL_TEAMS.forEach(team => {
      if (!koParticipants.has(team.code)) eliminated.add(team.code)
    })
  }

  // 2. Phase finale : Déduction classique + intelligente
  koMatches.forEach(m => {
    if (m.status !== "finished") return
    
    // Voie rapide : Score classique
    if (m.homeScore != null && m.awayScore != null && m.homeScore !== m.awayScore) {
      const loserCode = m.homeScore > m.awayScore ? m.awayTeam.code : m.homeTeam.code
      eliminated.add(loserCode)
    } 
    // Voie intelligente : Égalité (Tirs au but non renseignés)
    else if (m.homeScore === m.awayScore) {
      if (m.phase.includes("Demi")) {
        // En DF, les deux équipes jouent encore (Finale ou Petite Finale)
        // On cherche qui est en Finale pour déduire le vainqueur
        const homeInFinal = koMatches.some(fm => fm.phase === "Finale" && (fm.homeTeam.code === m.homeTeam.code || fm.awayTeam.code === m.homeTeam.code))
        const awayInFinal = koMatches.some(fm => fm.phase === "Finale" && (fm.homeTeam.code === m.awayTeam.code || fm.awayTeam.code === m.awayTeam.code))
        
        if (homeInFinal && !awayInFinal) eliminated.add(m.awayTeam.code)
        if (awayInFinal && !homeInFinal) eliminated.add(m.homeTeam.code)
      } else {
        // Look-ahead : l'équipe qui apparait dans un match ultérieur a gagné
        const homeHasFutureMatch = koMatches.some(fm => fm.date > m.date && (fm.homeTeam.code === m.homeTeam.code || fm.awayTeam.code === m.homeTeam.code))
        const awayHasFutureMatch = koMatches.some(fm => fm.date > m.date && (fm.homeTeam.code === m.awayTeam.code || fm.awayTeam.code === m.awayTeam.code))
        
        if (homeHasFutureMatch && !awayHasFutureMatch) eliminated.add(m.awayTeam.code)
        if (awayHasFutureMatch && !homeHasFutureMatch) eliminated.add(m.homeTeam.code)
      }
    }
  })

  return eliminated
}

// ─── Fetch principal ─────────────────────────────────────────────────────────

async function apiFetch<T>(action: string, id?: number): Promise<T | null> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

  let url = `${BASE_URL}?action=${action}`
  if (id !== undefined) url += `&id=${id}`

  try {
    const res = await fetch(url, {
      next: { revalidate: 30 }, // cache 30s
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        "Origin": "https://wcup2026.org",
        "Referer": "https://wcup2026.org/",
      }
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      console.error(`WorldCup API error ${res.status} for ${url}`)
      return null
    }

    const json = await res.json()
    if (!json.ok) {
      console.error(`WorldCup API returned ok=false for ${url}`)
      return null
    }
    
    return json as T
  } catch (err: any) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      console.warn(`⏳ Timeout de 5s dépassé pour ${url} - L'API distante ne répond pas.`)
    } else {
      console.error(`WorldCup API fetch error for ${url}:`, err.message)
    }
    return null
  }
}

// ─── Teams ───────────────────────────────────────────────────────────────────

export async function fetchAllAPITeams(): Promise<Team[]> {
  const matches = await fetchAllMatches()
  const eliminatedCodes = computeEliminatedTeams(matches)
  return ALL_TEAMS.map(t => buildTeamFromData(t, eliminatedCodes))
}

function buildFallbackTeams(eliminatedCodes?: Set<string>): Team[] {
  return ALL_TEAMS.map(t => buildTeamFromData(t, eliminatedCodes))
}

// ─── Matches ─────────────────────────────────────────────────────────────────

export async function fetchAllMatches(): Promise<Match[]> {
  const res = await apiFetch<{ matches: any[] }>("all")
  let games = res?.matches

  // FALLBACK LOGIC : Graceful Degradation
  if (!games) {
    console.warn("⚠️ WorldCup API indisponible. Utilisation du calendrier de secours (Fallback).")
    try {
      const fallbackData = require("@/data/fallback-games.json")
      // Le fallback est maintenant au même format que l'API communautaire,
      // mais on garde `.games` au cas où un ancien fichier serait encore utilisé.
      games = fallbackData.matches || fallbackData.games || []
    } catch (e) {
      console.error("Impossible de charger le fallback des matchs", e)
      return []
    }
  }

  if (!games) return []

  // Si on lit le fallback (ancien format), on utilise l'ancien mapping (simplifié ici).
  // Si c'est le nouveau format, on le map.
  const mappedMatches = games.map((g: any) => g.home_team_id ? mapOldRawGame(g) : mapRawGame(g)).filter(Boolean) as Match[]

  const eliminatedCodes = computeEliminatedTeams(mappedMatches)
  
  // Appliquer le statut d'élimination aux équipes dans les matchs
  mappedMatches.forEach(m => {
    if (eliminatedCodes.has(m.homeTeam.code)) m.homeTeam.isEliminated = true
    if (eliminatedCodes.has(m.awayTeam.code)) m.awayTeam.isEliminated = true
  })

  return mappedMatches
}

export async function fetchMatchDetails(id: number): Promise<Match | null> {
  const res = await apiFetch<{ match: any }>("match", id)
  if (!res || !res.match) return null
  return mapRawGame(res.match)
}

export async function fetchMatchesByDate(date: string): Promise<Match[]> {
  const all = await fetchAllMatches()
  return all.filter(m => m.date.startsWith(date))
}

export async function fetchLiveMatches(): Promise<Match[]> {
  const res = await apiFetch<{ matches: any[] }>("live")
  if (!res || !res.matches) return []
  return res.matches.map(mapRawGame).filter(Boolean) as Match[]
}

function parseScore(scoreArray: any[] | null | undefined, index: number): number | null {
  if (!scoreArray || !Array.isArray(scoreArray) || scoreArray.length < 2) return null
  const num = parseInt(scoreArray[index], 10)
  return isNaN(num) ? null : num
}

function mapRawGame(g: any): Match | null {
  try {
    let homeTeam: Team
    let awayTeam: Team

    const localHome = getTeamByName(g.team1 || "")
    homeTeam = localHome ? buildTeamFromData(localHome) : buildUnknownTeam(g.team1 || "TBD")

    const localAway = getTeamByName(g.team2 || "")
    awayTeam = localAway ? buildTeamFromData(localAway) : buildUnknownTeam(g.team2 || "TBD")

    const stadium: Stadium = {
      name: g.ground || "Stade inconnu",
      city: g.ground ? g.ground.split("(")[0].trim() : "",
      country: "",
      countryFlag: "🏳️",
      capacity: 0
    }

    // Datetime est un timestamp en secondes
    let dateStr = new Date().toISOString()
    if (g.datetime) {
      dateStr = new Date(g.datetime * 1000).toISOString()
    }

    let status = mapStatus(g.status)
    const phase = mapPhase(g.round || "group", g.group || "")
    let minute = null
    let isDataPending = false

    if (status === "live" && g.live_minute) {
      const parsed = parseInt(g.live_minute)
      if (!isNaN(parsed)) minute = parsed
    }

    // SIMULATION LIVE (Si fallback etc.)
    if (status === "scheduled") {
      const now = new Date()
      const matchDate = new Date(dateStr)
      const diffMinutes = Math.floor((now.getTime() - matchDate.getTime()) / 60000)
      
      if (diffMinutes >= 0 && diffMinutes <= 120) {
        status = "live"
        isDataPending = true
        minute = diffMinutes > 45 ? diffMinutes - 15 : diffMinutes
        if (minute < 0) minute = 0
        if (minute > 90) minute = 90
      } else if (diffMinutes > 120) {
        status = "finished"
        isDataPending = true
      }
    }

    // Events mapping
    const events: MatchEvent[] = []
    
    if (g.goals1 && Array.isArray(g.goals1)) {
      g.goals1.forEach((ev: any) => {
        events.push({ type: "goal", minute: parseInt(ev.minute) || 0, team: homeTeam.name, player: ev.name })
      })
    }
    if (g.goals2 && Array.isArray(g.goals2)) {
      g.goals2.forEach((ev: any) => {
        events.push({ type: "goal", minute: parseInt(ev.minute) || 0, team: awayTeam.name, player: ev.name })
      })
    }
    
    // Cards mapping
    if (g.cards && Array.isArray(g.cards)) {
      g.cards.forEach((card: any) => {
        const teamName = card.team === 1 ? homeTeam.name : awayTeam.name
        const type = card.type === "yellow" ? "yellow_card" : "red_card"
        events.push({ type, minute: parseInt(card.minute) || 0, team: teamName, player: card.name })
      })
    }
    
    events.sort((a, b) => a.minute - b.minute)

    // Stats mapping
    const stats: MatchStat[] = []
    const statTranslations: Record<string, string> = {
      "Possession": "Possession",
      "Shots": "Tirs",
      "Shots on target": "Tirs cadrés",
      "Corners": "Corners",
      "Offsides": "Hors-jeu",
      "Fouls": "Fautes",
      "Yellow cards": "Cartons jaunes",
      "Saves": "Arrêts"
    }

    if (g.stats && Array.isArray(g.stats)) {
      g.stats.forEach((s: any) => {
        stats.push({
          key: statTranslations[s.k_en] || s.k_en || s.k,
          keyEn: s.k_en,
          homeValue: Array.isArray(s.v) ? s.v[0] : 0,
          awayValue: Array.isArray(s.v) ? s.v[1] : 0,
          unit: s.unit || ""
        })
      })
    }

    return {
      id: parseInt(g.id) || Math.random(),
      homeTeam,
      awayTeam,
      homeScore: parseScore(g.score, 0),
      awayScore: parseScore(g.score, 1),
      date: dateStr,
      stadium,
      phase,
      status,
      minute,
      isDataPending,
      events,
      stats,
    }
  } catch (e) {
    console.error("Erreur mapping game", e, g)
    return null
  }
}

// Mapping complet du format de l'ancienne API iranienne (fallback-games.json)
function mapOldRawGame(g: any): Match | null {
  try {
    let homeTeam: Team
    let awayTeam: Team

    if (g.home_team_id === "0") {
      homeTeam = buildUnknownTeam(g.home_team_label || "TBD")
    } else {
      const localHome = getTeamByApiId(g.home_team_id) || getTeamByName(g.home_team_name_en || "")
      homeTeam = localHome ? buildTeamFromData(localHome) : buildUnknownTeam(g.home_team_name_en || "TBD")
    }

    if (g.away_team_id === "0") {
      awayTeam = buildUnknownTeam(g.away_team_label || "TBD")
    } else {
      const localAway = getTeamByApiId(g.away_team_id) || getTeamByName(g.away_team_name_en || "")
      awayTeam = localAway ? buildTeamFromData(localAway) : buildUnknownTeam(g.away_team_name_en || "TBD")
    }

    // Parse date from old format "MM/DD/YYYY HH:mm"
    let dateStr = new Date().toISOString()
    if (g.local_date) {
      try {
        const [datePart, timePart] = g.local_date.split(' ')
        const [month, day, year] = datePart.split('/')
        const [hours, minutes] = (timePart || '00:00').split(':')
        // Use Eastern time (UTC-4) as default for old fallback data
        const d = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours) + 4, parseInt(minutes)))
        dateStr = d.toISOString()
      } catch {}
    }

    let status: MatchStatus = "scheduled"
    if (g.finished === "TRUE" || g.time_elapsed === "finished") status = "finished"
    else if (g.time_elapsed === "notstarted") status = "scheduled"
    else if (g.time_elapsed && g.time_elapsed !== "notstarted" && g.time_elapsed !== "finished") status = "live"

    const phase = mapPhase(g.type || "group", g.group || "")

    const homeScore = g.finished === "TRUE" ? (parseInt(g.home_score) || 0) : null
    const awayScore = g.finished === "TRUE" ? (parseInt(g.away_score) || 0) : null

    return {
      id: parseInt(g.id) || Math.random(),
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      date: dateStr,
      stadium: { name: "Stade (données de secours)", city: "", country: "", countryFlag: "🏳️", capacity: 0 },
      phase,
      status,
      minute: null,
      isDataPending: false,
      events: []
    }
  } catch (e) {
    console.error("Erreur mapping old fallback game", e, g)
    return null
  }
}


function mapPhase(round: string, groupRaw: string): string {
  const r = round.toLowerCase()
  if (r.includes("final") && !r.includes("quarter") && !r.includes("semi") && !r.includes("third")) return "Finale"
  if (r.includes("third") || r.includes("3rd")) return "Petite Finale"
  if (r.includes("semi")) return "Demi-finales"
  if (r.includes("quarter")) return "Quarts de Finale"
  if (r.includes("round of 16") || r.includes("1/8")) return "1/8 de Finale"
  if (r.includes("round of 32") || r.includes("1/16")) return "1/16 de Finale"

  if (r.includes("matchday") || groupRaw) {
    const grp = groupRaw.replace("Group", "").trim().toUpperCase()
    return grp ? `Groupe ${grp}` : "Phase de groupes"
  }
  return "Inconnu"
}

// ─── Standings & Scorers ──────────────────────────────────────────────────────

export interface Scorer {
  name: string
  team: string
  goals: number
}

export async function fetchScorers(): Promise<Scorer[]> {
  const res = await apiFetch<{ scorers: any[] }>("scorers")
  if (!res || !res.scorers) return []
  return res.scorers.map(s => ({
    name: s.name,
    team: s.team,
    goals: parseInt(s.goals) || 0
  }))
}

export async function fetchStandings(): Promise<Group[]> {
  const res = await apiFetch<{ standings: Record<string, any[]> }>("standings")
  const matches = await fetchAllMatches()
  const eliminatedCodes = computeEliminatedTeams(matches)

  if (!res || !res.standings) return buildFallbackStandings(eliminatedCodes)

  const groups: Group[] = []
  
  for (const [groupName, teams] of Object.entries(res.standings)) {
    const mapped = mapRawGroup(groupName, teams, eliminatedCodes)
    if (mapped) groups.push(mapped)
  }
  
  return groups
}

function mapRawGroup(groupName: string, teamsArray: any[], eliminatedCodes?: Set<string>): Group | null {
  try {
    const name = groupName.replace("Group", "Groupe").trim()
    const teams: Standing[] = (teamsArray || []).map((s: any, i: number) => {

      // The new API uses "team" for the English name
      const localData = getTeamByName(s.team)
      const team = localData ? buildTeamFromData(localData, eliminatedCodes) : buildUnknownTeam(s.team)

      return {
        team,
        played: parseInt(s.p) || 0,
        won: parseInt(s.w) || 0,
        drawn: parseInt(s.d) || 0,
        lost: parseInt(s.l) || 0,
        goalsFor: parseInt(s.gf) || 0, // new API uses gf, old used f
        goalsAgainst: parseInt(s.ga) || 0, // new API uses ga, old used a
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

function buildFallbackStandings(eliminatedCodes?: Set<string>): Group[] {
  // Groupes de secours basés sur nos données statiques
  const groups: Record<string, Group> = {}

  ALL_TEAMS.forEach(t => {
    if (!groups[t.group]) {
      groups[t.group] = { name: t.group, teams: [], isDataPending: true }
    }
    groups[t.group].teams.push({
      team: buildTeamFromData(t, eliminatedCodes),
      played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, goalDifference: 0,
      points: 0, position: groups[t.group].teams.length + 1,
    })
  })

  return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name))
}
