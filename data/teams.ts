// data/teams.ts
// All 48 FIFA World Cup 2026 teams — aligned with worldcup26.ir API
// apiId corresponds to the "id" field in the API response

export interface TeamData {
  id: number
  apiId: string          // ID numérique de l'API worldcup26.ir
  name: string           // Nom en français
  nameEn: string         // Nom anglais (de l'API)
  code: string           // Code FIFA (3 lettres)
  flag: string           // Emoji drapeau
  flagUrl: string        // URL drapeau (flagcdn.com)
  group: string
  isAfrican: boolean
  isEliminated: boolean
  eliminatedAt?: string
}

export const AFRICAN_CODES = ["ZAF", "MAR", "CIV", "TUN", "EGY", "CPV", "SEN", "ALG", "COD", "GHA"]

export const ALL_TEAMS: TeamData[] = [
  // ─── Groupe A ───────────────────────────────────────────────────────────────
  { id: 1,  apiId: "1",  name: "Mexique",             nameEn: "Mexico",            code: "MEX", flag: "🇲🇽", flagUrl: "https://flagcdn.com/w80/mx.png",      group: "A", isAfrican: false, isEliminated: false },
  { id: 2,  apiId: "2",  name: "Afrique du Sud",      nameEn: "South Africa",      code: "RSA", flag: "🇿🇦", flagUrl: "https://flagcdn.com/w80/za.png",      group: "A", isAfrican: true,  isEliminated: false },
  { id: 3,  apiId: "3",  name: "Corée du Sud",        nameEn: "South Korea",       code: "KOR", flag: "🇰🇷", flagUrl: "https://flagcdn.com/w80/kr.png",      group: "A", isAfrican: false, isEliminated: false },
  { id: 4,  apiId: "4",  name: "République tchèque",  nameEn: "Czech Republic",    code: "CZE", flag: "🇨🇿", flagUrl: "https://flagcdn.com/w80/cz.png",      group: "A", isAfrican: false, isEliminated: false },

  // ─── Groupe B ───────────────────────────────────────────────────────────────
  { id: 5,  apiId: "5",  name: "Canada",              nameEn: "Canada",            code: "CAN", flag: "🇨🇦", flagUrl: "https://flagcdn.com/w80/ca.png",      group: "B", isAfrican: false, isEliminated: false },
  { id: 6,  apiId: "6",  name: "Bosnie-Herzégovine",  nameEn: "Bosnia and Herzegovina", code: "BIH", flag: "🇧🇦", flagUrl: "https://flagcdn.com/w80/ba.png", group: "B", isAfrican: false, isEliminated: false },
  { id: 7,  apiId: "7",  name: "Qatar",               nameEn: "Qatar",             code: "QAT", flag: "🇶🇦", flagUrl: "https://flagcdn.com/w80/qa.png",      group: "B", isAfrican: false, isEliminated: false },
  { id: 8,  apiId: "8",  name: "Suisse",              nameEn: "Switzerland",       code: "SUI", flag: "🇨🇭", flagUrl: "https://flagcdn.com/w80/ch.png",      group: "B", isAfrican: false, isEliminated: false },

  // ─── Groupe C ───────────────────────────────────────────────────────────────
  { id: 9,  apiId: "9",  name: "Brésil",              nameEn: "Brazil",            code: "BRA", flag: "🇧🇷", flagUrl: "https://flagcdn.com/w80/br.png",      group: "C", isAfrican: false, isEliminated: false },
  { id: 10, apiId: "10", name: "Maroc",               nameEn: "Morocco",           code: "MAR", flag: "🇲🇦", flagUrl: "https://flagcdn.com/w80/ma.png",      group: "C", isAfrican: true,  isEliminated: false },
  { id: 11, apiId: "11", name: "Haïti",               nameEn: "Haiti",             code: "HAI", flag: "🇭🇹", flagUrl: "https://flagcdn.com/w80/ht.png",      group: "C", isAfrican: false, isEliminated: false },
  { id: 12, apiId: "12", name: "Écosse",              nameEn: "Scotland",          code: "SCO", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", flagUrl: "https://flagcdn.com/w80/gb-sct.png", group: "C", isAfrican: false, isEliminated: false },

  // ─── Groupe D ───────────────────────────────────────────────────────────────
  { id: 13, apiId: "13", name: "États-Unis",          nameEn: "United States",     code: "USA", flag: "🇺🇸", flagUrl: "https://flagcdn.com/w80/us.png",      group: "D", isAfrican: false, isEliminated: false },
  { id: 14, apiId: "14", name: "Paraguay",            nameEn: "Paraguay",          code: "PAR", flag: "🇵🇾", flagUrl: "https://flagcdn.com/w80/py.png",      group: "D", isAfrican: false, isEliminated: false },
  { id: 15, apiId: "15", name: "Australie",           nameEn: "Australia",         code: "AUS", flag: "🇦🇺", flagUrl: "https://flagcdn.com/w80/au.png",      group: "D", isAfrican: false, isEliminated: false },
  { id: 16, apiId: "16", name: "Turquie",             nameEn: "Turkey",            code: "TUR", flag: "🇹🇷", flagUrl: "https://flagcdn.com/w80/tr.png",      group: "D", isAfrican: false, isEliminated: false },

  // ─── Groupe E ───────────────────────────────────────────────────────────────
  { id: 17, apiId: "17", name: "Allemagne",           nameEn: "Germany",           code: "GER", flag: "🇩🇪", flagUrl: "https://flagcdn.com/w80/de.png",      group: "E", isAfrican: false, isEliminated: false },
  { id: 18, apiId: "18", name: "Curaçao",             nameEn: "Curaçao",           code: "CUW", flag: "🇨🇼", flagUrl: "https://flagcdn.com/w80/cw.png",      group: "E", isAfrican: false, isEliminated: false },
  { id: 19, apiId: "19", name: "Côte d'Ivoire",       nameEn: "Ivory Coast",       code: "CIV", flag: "🇨🇮", flagUrl: "https://flagcdn.com/w80/ci.png",      group: "E", isAfrican: true,  isEliminated: false },
  { id: 20, apiId: "20", name: "Équateur",            nameEn: "Ecuador",           code: "ECU", flag: "🇪🇨", flagUrl: "https://flagcdn.com/w80/ec.png",      group: "E", isAfrican: false, isEliminated: false },

  // ─── Groupe F ───────────────────────────────────────────────────────────────
  { id: 21, apiId: "21", name: "Pays-Bas",            nameEn: "Netherlands",       code: "NED", flag: "🇳🇱", flagUrl: "https://flagcdn.com/w80/nl.png",      group: "F", isAfrican: false, isEliminated: false },
  { id: 22, apiId: "22", name: "Japon",               nameEn: "Japan",             code: "JPN", flag: "🇯🇵", flagUrl: "https://flagcdn.com/w80/jp.png",      group: "F", isAfrican: false, isEliminated: false },
  { id: 23, apiId: "23", name: "Suède",               nameEn: "Sweden",            code: "SWE", flag: "🇸🇪", flagUrl: "https://flagcdn.com/w80/se.png",      group: "F", isAfrican: false, isEliminated: false },
  { id: 24, apiId: "24", name: "Tunisie",             nameEn: "Tunisia",           code: "TUN", flag: "🇹🇳", flagUrl: "https://flagcdn.com/w80/tn.png",      group: "F", isAfrican: true,  isEliminated: false },

  // ─── Groupe G ───────────────────────────────────────────────────────────────
  { id: 25, apiId: "25", name: "Belgique",            nameEn: "Belgium",           code: "BEL", flag: "🇧🇪", flagUrl: "https://flagcdn.com/w80/be.png",      group: "G", isAfrican: false, isEliminated: false },
  { id: 26, apiId: "26", name: "Égypte",              nameEn: "Egypt",             code: "EGY", flag: "🇪🇬", flagUrl: "https://flagcdn.com/w80/eg.png",      group: "G", isAfrican: true,  isEliminated: false },
  { id: 27, apiId: "27", name: "Iran",                nameEn: "Iran",              code: "IRN", flag: "🇮🇷", flagUrl: "https://flagcdn.com/w80/ir.png",      group: "G", isAfrican: false, isEliminated: false },
  { id: 28, apiId: "28", name: "Nouvelle-Zélande",    nameEn: "New Zealand",       code: "NZL", flag: "🇳🇿", flagUrl: "https://flagcdn.com/w80/nz.png",      group: "G", isAfrican: false, isEliminated: false },

  // ─── Groupe H ───────────────────────────────────────────────────────────────
  { id: 29, apiId: "29", name: "Espagne",             nameEn: "Spain",             code: "ESP", flag: "🇪🇸", flagUrl: "https://flagcdn.com/w80/es.png",      group: "H", isAfrican: false, isEliminated: false },
  { id: 30, apiId: "30", name: "Cap-Vert",            nameEn: "Cape Verde",        code: "CPV", flag: "🇨🇻", flagUrl: "https://flagcdn.com/w80/cv.png",      group: "H", isAfrican: true,  isEliminated: false },
  { id: 31, apiId: "31", name: "Arabie Saoudite",     nameEn: "Saudi Arabia",      code: "KSA", flag: "🇸🇦", flagUrl: "https://flagcdn.com/w80/sa.png",      group: "H", isAfrican: false, isEliminated: false },
  { id: 32, apiId: "32", name: "Uruguay",             nameEn: "Uruguay",           code: "URU", flag: "🇺🇾", flagUrl: "https://flagcdn.com/w80/uy.png",      group: "H", isAfrican: false, isEliminated: false },

  // ─── Groupe I ───────────────────────────────────────────────────────────────
  { id: 33, apiId: "33", name: "France",              nameEn: "France",            code: "FRA", flag: "🇫🇷", flagUrl: "https://flagcdn.com/w80/fr.png",      group: "I", isAfrican: false, isEliminated: false },
  { id: 34, apiId: "34", name: "Sénégal",             nameEn: "Senegal",           code: "SEN", flag: "🇸🇳", flagUrl: "https://flagcdn.com/w80/sn.png",      group: "I", isAfrican: true,  isEliminated: false },
  { id: 35, apiId: "35", name: "Irak",                nameEn: "Iraq",              code: "IRQ", flag: "🇮🇶", flagUrl: "https://flagcdn.com/w80/iq.png",      group: "I", isAfrican: false, isEliminated: false },
  { id: 36, apiId: "36", name: "Norvège",             nameEn: "Norway",            code: "NOR", flag: "🇳🇴", flagUrl: "https://flagcdn.com/w80/no.png",      group: "I", isAfrican: false, isEliminated: false },

  // ─── Groupe J ───────────────────────────────────────────────────────────────
  { id: 37, apiId: "37", name: "Argentine",           nameEn: "Argentina",         code: "ARG", flag: "🇦🇷", flagUrl: "https://flagcdn.com/w80/ar.png",      group: "J", isAfrican: false, isEliminated: false },
  { id: 38, apiId: "38", name: "Algérie",             nameEn: "Algeria",           code: "ALG", flag: "🇩🇿", flagUrl: "https://flagcdn.com/w80/dz.png",      group: "J", isAfrican: true,  isEliminated: false },
  { id: 39, apiId: "39", name: "Autriche",            nameEn: "Austria",           code: "AUT", flag: "🇦🇹", flagUrl: "https://flagcdn.com/w80/at.png",      group: "J", isAfrican: false, isEliminated: false },
  { id: 40, apiId: "40", name: "Jordanie",            nameEn: "Jordan",            code: "JOR", flag: "🇯🇴", flagUrl: "https://flagcdn.com/w80/jo.png",      group: "J", isAfrican: false, isEliminated: false },

  // ─── Groupe K ───────────────────────────────────────────────────────────────
  { id: 41, apiId: "41", name: "Portugal",            nameEn: "Portugal",          code: "POR", flag: "🇵🇹", flagUrl: "https://flagcdn.com/w80/pt.png",      group: "K", isAfrican: false, isEliminated: false },
  { id: 42, apiId: "42", name: "Rép. Dém. du Congo",  nameEn: "Democratic Republic of the Congo", code: "COD", flag: "🇨🇩", flagUrl: "https://flagcdn.com/w80/cd.png", group: "K", isAfrican: true,  isEliminated: false },
  { id: 43, apiId: "43", name: "Ouzbékistan",         nameEn: "Uzbekistan",        code: "UZB", flag: "🇺🇿", flagUrl: "https://flagcdn.com/w80/uz.png",      group: "K", isAfrican: false, isEliminated: false },
  { id: 44, apiId: "44", name: "Colombie",            nameEn: "Colombia",          code: "COL", flag: "🇨🇴", flagUrl: "https://flagcdn.com/w80/co.png",      group: "K", isAfrican: false, isEliminated: false },

  // ─── Groupe L ───────────────────────────────────────────────────────────────
  { id: 45, apiId: "45", name: "Angleterre",          nameEn: "England",           code: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", flagUrl: "https://flagcdn.com/w80/gb-eng.png", group: "L", isAfrican: false, isEliminated: false },
  { id: 46, apiId: "46", name: "Croatie",             nameEn: "Croatia",           code: "CRO", flag: "🇭🇷", flagUrl: "https://flagcdn.com/w80/hr.png",      group: "L", isAfrican: false, isEliminated: false },
  { id: 47, apiId: "47", name: "Ghana",               nameEn: "Ghana",             code: "GHA", flag: "🇬🇭", flagUrl: "https://flagcdn.com/w80/gh.png",      group: "L", isAfrican: true,  isEliminated: false },
  { id: 48, apiId: "48", name: "Panama",              nameEn: "Panama",            code: "PAN", flag: "🇵🇦", flagUrl: "https://flagcdn.com/w80/pa.png",      group: "L", isAfrican: false, isEliminated: false },
]

// ─── Lookups ──────────────────────────────────────────────────────────────────

/** Map apiId → TeamData pour résoudre les team_id numériques de l'API */
const API_ID_MAP = new Map<string, TeamData>(ALL_TEAMS.map(t => [t.apiId, t]))

/** Map code → TeamData pour résoudre les codes FIFA */
const CODE_MAP = new Map<string, TeamData>(ALL_TEAMS.map(t => [t.code, t]))

/** Map fifa_code → code interne (pour gérer les différences de nommage) */
const FIFA_CODE_TO_INTERNAL: Record<string, string> = {
  // L'API utilise "RSA" pour l'Afrique du Sud, on mappe vers notre code "RSA"
  // Aucune divergence majeure, mais garder le mapping pour safety
  "ZAF": "RSA",  // Si jamais on rencontre ZAF
}

export const AFRICAN_TEAMS = ALL_TEAMS.filter(t => t.isAfrican)

export const SUGGESTED_EXTRA_TEAMS = ALL_TEAMS.filter(t =>
  ["BRA", "FRA", "ARG", "GER", "ENG", "POR", "ESP"].includes(t.code)
)

export const NON_AFRICAN_TEAMS = ALL_TEAMS.filter(t => !t.isAfrican)

export function getTeamByCode(code: string): TeamData | undefined {
  return CODE_MAP.get(code) || CODE_MAP.get(FIFA_CODE_TO_INTERNAL[code] || "")
}

export function getTeamByApiId(apiId: string): TeamData | undefined {
  return API_ID_MAP.get(apiId)
}

export function getTeamFlag(code: string): string {
  return getTeamByCode(code)?.flag ?? "🏳️"
}

export function getTeamFlagUrl(code: string): string {
  return getTeamByCode(code)?.flagUrl ?? ""
}
