export interface BracketMatch {
  id: string
  round: "r32" | "r16" | "qf" | "sf" | "third" | "final"
  matchNumber: number
  homeLabel: string
  awayLabel: string
  homeTeamCode?: string
  awayTeamCode?: string
  homeScore?: number | null
  awayScore?: number | null
  date: string
  stadium: string
  city: string
  status?: string
}

export interface BracketRound {
  id: string
  name: string
  matches: BracketMatch[]
}

const AFRICAN_CODES = ["RSA", "MAR", "CIV", "TUN", "EGY", "CPV", "SEN", "ALG", "COD", "GHA"]

export function getBracketRounds(): BracketRound[] {
  const r32: BracketMatch[] = [
    { id: "73", round: "r32", matchNumber: 73, homeLabel: "2e Groupe A", awayLabel: "2e Groupe B", date: "2026-06-28T19:00:00Z", stadium: "SoFi Stadium", city: "Los Angeles" },
    { id: "74", round: "r32", matchNumber: 74, homeLabel: "1er Groupe E", awayLabel: "3e Groupe A/B/C/D/F", date: "2026-06-29T23:30:00Z", stadium: "Gillette Stadium", city: "Boston" },
    { id: "75", round: "r32", matchNumber: 75, homeLabel: "1er Groupe F", awayLabel: "2e Groupe C", date: "2026-06-30T02:00:00Z", stadium: "Estadio Monterrey", city: "Monterrey" },
    { id: "76", round: "r32", matchNumber: 76, homeLabel: "1er Groupe C", awayLabel: "2e Groupe F", date: "2026-06-29T19:00:00Z", stadium: "NRG Stadium", city: "Houston" },
    { id: "77", round: "r32", matchNumber: 77, homeLabel: "1er Groupe I", awayLabel: "3e Groupe C/D/F/G/H", date: "2026-06-30T21:00:00Z", stadium: "MetLife Stadium", city: "New York/New Jersey" },
    { id: "78", round: "r32", matchNumber: 78, homeLabel: "2e Groupe E", awayLabel: "2e Groupe I", date: "2026-06-30T19:00:00Z", stadium: "AT&T Stadium", city: "Dallas" },
    { id: "79", round: "r32", matchNumber: 79, homeLabel: "1er Groupe A", awayLabel: "3e Groupe C/E/F/H/I", date: "2026-07-01T02:00:00Z", stadium: "Estadio Azteca", city: "Mexico City" },
    { id: "80", round: "r32", matchNumber: 80, homeLabel: "1er Groupe L", awayLabel: "3e Groupe E/H/I/J/K", date: "2026-07-01T19:00:00Z", stadium: "Mercedes-Benz Stadium", city: "Atlanta" },
    { id: "81", round: "r32", matchNumber: 81, homeLabel: "1er Groupe D", awayLabel: "3e Groupe B/E/F/I/J", date: "2026-07-01T21:00:00Z", stadium: "Levi's Stadium", city: "San Francisco" },
    { id: "82", round: "r32", matchNumber: 82, homeLabel: "1er Groupe G", awayLabel: "3e Groupe A/E/H/I/J", date: "2026-07-01T20:00:00Z", stadium: "Lumen Field", city: "Seattle" },
    { id: "83", round: "r32", matchNumber: 83, homeLabel: "2e Groupe K", awayLabel: "2e Groupe L", date: "2026-07-03T02:00:00Z", stadium: "BMO Field", city: "Toronto" },
    { id: "84", round: "r32", matchNumber: 84, homeLabel: "1er Groupe H", awayLabel: "2e Groupe J", date: "2026-07-02T19:00:00Z", stadium: "SoFi Stadium", city: "Los Angeles" },
    { id: "85", round: "r32", matchNumber: 85, homeLabel: "1er Groupe B", awayLabel: "3e Groupe E/F/G/I/J", date: "2026-07-03T03:00:00Z", stadium: "BC Place", city: "Vancouver" },
    { id: "86", round: "r32", matchNumber: 86, homeLabel: "1er Groupe J", awayLabel: "2e Groupe H", date: "2026-07-03T22:00:00Z", stadium: "Hard Rock Stadium", city: "Miami" },
    { id: "87", round: "r32", matchNumber: 87, homeLabel: "1er Groupe K", awayLabel: "3e Groupe D/E/I/J/L", date: "2026-07-04T03:30:00Z", stadium: "Arrowhead Stadium", city: "Kansas City" },
    { id: "88", round: "r32", matchNumber: 88, homeLabel: "2e Groupe D", awayLabel: "2e Groupe G", date: "2026-07-03T20:00:00Z", stadium: "AT&T Stadium", city: "Dallas" }
  ]

  const r16: BracketMatch[] = [
    { id: "89", round: "r16", matchNumber: 89, homeLabel: "Vainqueur M74", awayLabel: "Vainqueur M77", date: "2026-07-04T21:00:00Z", stadium: "Lincoln Financial Field", city: "Philadelphia" },
    { id: "90", round: "r16", matchNumber: 90, homeLabel: "Vainqueur M73", awayLabel: "Vainqueur M75", date: "2026-07-04T19:00:00Z", stadium: "NRG Stadium", city: "Houston" },
    { id: "91", round: "r16", matchNumber: 91, homeLabel: "Vainqueur M76", awayLabel: "Vainqueur M78", date: "2026-07-05T20:00:00Z", stadium: "MetLife Stadium", city: "New York/New Jersey" },
    { id: "92", round: "r16", matchNumber: 92, homeLabel: "Vainqueur M79", awayLabel: "Vainqueur M80", date: "2026-07-06T01:00:00Z", stadium: "Estadio Azteca", city: "Mexico City" },
    { id: "93", round: "r16", matchNumber: 93, homeLabel: "Vainqueur M83", awayLabel: "Vainqueur M84", date: "2026-07-06T21:00:00Z", stadium: "AT&T Stadium", city: "Dallas" },
    { id: "94", round: "r16", matchNumber: 94, homeLabel: "Vainqueur M81", awayLabel: "Vainqueur M82", date: "2026-07-07T00:00:00Z", stadium: "Lumen Field", city: "Seattle" },
    { id: "95", round: "r16", matchNumber: 95, homeLabel: "Vainqueur M86", awayLabel: "Vainqueur M88", date: "2026-07-07T19:00:00Z", stadium: "Mercedes-Benz Stadium", city: "Atlanta" },
    { id: "96", round: "r16", matchNumber: 96, homeLabel: "Vainqueur M85", awayLabel: "Vainqueur M87", date: "2026-07-07T20:00:00Z", stadium: "BC Place", city: "Vancouver" }
  ]

  const quarterFinals: BracketMatch[] = [
    { id: "97", round: "qf", matchNumber: 97, homeLabel: "Vainqueur M89", awayLabel: "Vainqueur M90", date: "2026-07-09T20:00:00Z", stadium: "Gillette Stadium", city: "Boston" },
    { id: "98", round: "qf", matchNumber: 98, homeLabel: "Vainqueur M93", awayLabel: "Vainqueur M94", date: "2026-07-10T19:00:00Z", stadium: "SoFi Stadium", city: "Los Angeles" },
    { id: "99", round: "qf", matchNumber: 99, homeLabel: "Vainqueur M91", awayLabel: "Vainqueur M92", date: "2026-07-11T21:00:00Z", stadium: "Hard Rock Stadium", city: "Miami" },
    { id: "100", round: "qf", matchNumber: 100, homeLabel: "Vainqueur M95", awayLabel: "Vainqueur M96", date: "2026-07-12T01:00:00Z", stadium: "Arrowhead Stadium", city: "Kansas City" }
  ]

  const semiFinals: BracketMatch[] = [
    { id: "101", round: "sf", matchNumber: 101, homeLabel: "Vainqueur QF97", awayLabel: "Vainqueur QF98", date: "2026-07-14T21:00:00Z", stadium: "AT&T Stadium", city: "Dallas" },
    { id: "102", round: "sf", matchNumber: 102, homeLabel: "Vainqueur QF99", awayLabel: "Vainqueur QF100", date: "2026-07-15T22:00:00Z", stadium: "Mercedes-Benz Stadium", city: "Atlanta" }
  ]

  const finals: BracketMatch[] = [
    { id: "103", round: "third", matchNumber: 103, homeLabel: "Perdant SF101", awayLabel: "Perdant SF102", date: "2026-07-18T21:00:00Z", stadium: "Hard Rock Stadium", city: "Miami" },
    { id: "104", round: "final", matchNumber: 104, homeLabel: "Vainqueur SF101", awayLabel: "Vainqueur SF102", date: "2026-07-19T19:00:00Z", stadium: "MetLife Stadium", city: "New York/New Jersey" }
  ]

  return [
    { id: "r32", name: "1/16 de finale", matches: r32 },
    { id: "r16", name: "Huitièmes de finale", matches: r16 },
    { id: "qf", name: "Quarts de finale", matches: quarterFinals },
    { id: "sf", name: "Demi-finale", matches: semiFinals },
    { id: "third", name: "Petite finale", matches: [finals[0]] },
    { id: "final", name: "Finale", matches: [finals[1]] },
  ]
}

export function isAfricanTeam(code: string): boolean {
  return AFRICAN_CODES.includes(code)
}
