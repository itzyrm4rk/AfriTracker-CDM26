"use client"
// Détecte les états spéciaux de la compétition : élimination, finale, champion

import { useEffect, useRef, useState } from "react"
import { useLiveScores } from "./useLiveScores"
import { useTeams } from "./useTeams"
import { ALL_TEAMS, AFRICAN_CODES } from "@/data/teams"
import { showEliminationToast } from "@/components/ui/special-states/EliminationToast"
import type { Team } from "@/types"

export interface CompetitionStats {
  matches: number
  wins: number
  goals: number
}

export function useCompetitionState() {
  const { allMatches } = useLiveScores() as unknown as { allMatches: import("@/types").Match[] }
  const { africanTeams, extraTeams } = useTeams()
  const previouslyEliminated = useRef<Set<string>>(new Set())

  const [allAfricaEliminated, setAllAfricaEliminated] = useState(false)
  const [championTeam, setChampionTeam] = useState<Team | null>(null)
  const [finalMatch, setFinalMatch] = useState<import("@/types").Match | null>(null)
  const [africanStats, setAfricanStats] = useState<CompetitionStats>({ matches: 0, wins: 0, goals: 0 })
  const [championStats, setChampionStats] = useState<{ matches: number; goals: number }>({ matches: 0, goals: 0 })

  useEffect(() => {
    if (!allMatches || allMatches.length === 0) return

    // Détection des équipes nouvellement éliminées (parmi les équipes africaines suivies)
    const eliminatedNow = ALL_TEAMS.filter(t => t.isEliminated && AFRICAN_CODES.includes(t.code))

    eliminatedNow.forEach(team => {
      if (!previouslyEliminated.current.has(team.code)) {
        previouslyEliminated.current.add(team.code)
        showEliminationToast(team as unknown as Team)
      }
    })

    // Toutes les équipes africaines éliminées ?
    const allEliminated = AFRICAN_CODES.every(code => {
      const t = ALL_TEAMS.find(team => team.code === code)
      return t?.isEliminated
    })
    setAllAfricaEliminated(allEliminated)

    // Calcul des statistiques globales africaines
    let aMatches = 0
    let aWins = 0
    let aGoals = 0

    allMatches.forEach(m => {
      if (m.status !== "finished") return

      const homeIsAf = AFRICAN_CODES.includes(m.homeTeam.code)
      const awayIsAf = AFRICAN_CODES.includes(m.awayTeam.code)
      const hScore = m.homeScore || 0
      const aScore = m.awayScore || 0

      if (homeIsAf || awayIsAf) {
        aMatches++
        if (homeIsAf) aGoals += hScore
        if (awayIsAf) aGoals += aScore

        if (homeIsAf && !awayIsAf && hScore > aScore) aWins++
        else if (awayIsAf && !homeIsAf && aScore > hScore) aWins++
        else if (homeIsAf && awayIsAf && hScore !== aScore) aWins++
      }
    })
    setAfricanStats({ matches: aMatches, wins: aWins, goals: aGoals })

    // Détection de la finale
    const final = allMatches.find(m => m.phase === "Finale")
    setFinalMatch(final ?? null)

    // Détection du champion (finale terminée)
    if (final && final.status === "finished" && final.homeScore != null && final.awayScore != null) {
      const winner = final.homeScore > final.awayScore ? final.homeTeam : final.awayTeam
      if (AFRICAN_CODES.includes(winner.code)) {
        setChampionTeam(winner)

        // Calcul des stats du champion
        let cMatches = 0
        let cGoals = 0
        allMatches.forEach(m => {
          if (m.status === "finished" && (m.homeTeam.code === winner.code || m.awayTeam.code === winner.code)) {
            cMatches++
            cGoals += m.homeTeam.code === winner.code ? (m.homeScore || 0) : (m.awayScore || 0)
          }
        })
        setChampionStats({ matches: cMatches, goals: cGoals })
      }
    }
  }, [allMatches])

  return {
    allAfricaEliminated,
    hasExtraTeams: extraTeams.length > 0,
    championTeam,
    finalMatch,
    africanTeams,
    africanStats,
    championStats,
  }
}
