export interface Team {
  id: number | string
  apiId?: string
  name: string
  code: string
  flag: string
  flagUrl?: string
  group: string
  isAfrican: boolean
  isEliminated: boolean
  eliminatedAt?: string
}

export interface Match {
  id: number
  homeTeam: Team
  awayTeam: Team
  homeScore: number | null
  awayScore: number | null
  date: string // ISO UTC
  stadium: Stadium
  phase: string
  status: MatchStatus
  minute: number | null
  events: MatchEvent[]
}

export type MatchStatus = "scheduled" | "live" | "finished" | "postponed"

export interface MatchEvent {
  type: "goal" | "yellow_card" | "red_card" | "substitution"
  minute: number
  team: string
  player: string
}

export interface Group {
  name: string
  teams: Standing[]
}

export interface Standing {
  team: Team
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  position: number
}

export interface Stadium {
  name: string
  city: string
  country: string
  countryFlag: string
  capacity: number
}

export interface Momentum {
  text: string
  date: string
  matchesOfTheDay: string[]
}

export interface UserPreferences {
  african_teams: string[]
  extra_teams: string[]
  onboarding_done: boolean
  momentum_seen_date: string | null
}
