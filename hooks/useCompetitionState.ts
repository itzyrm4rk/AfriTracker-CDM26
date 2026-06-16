"use client"
// Détecte les états spéciaux de la compétition : élimination, finale, champion

import { useEffect, useRef, useState } from "react"
import { useLiveScores } from "./useLiveScores"
import { useTeams } from "./useTeams"
import { ALL_TEAMS, AFRICAN_CODES } from "@/data/teams"
import { showEliminationToast } from "@/components/ui/special-states/EliminationToast"
import type { Team } from "@/types"

export function useCompetitionState() {
  const { allMatches } = useLiveScores() as unknown as { allMatches: import("@/types").Match[] }
  const { africanTeams, extraTeams } = useTeams()
  const previouslyEliminated = useRef<Set<string>>(new Set())

  const [allAfricaEliminated, setAllAfricaEliminated] = useState(false)
  const [championTeam, setChampionTeam] = useState<Team | null>(null)
  const [finalMatch, setFinalMatch] = useState<import("@/types").Match | null>(null)

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

    // Détection de la finale
    const final = allMatches.find(m => m.phase === "Finale")
    setFinalMatch(final ?? null)

    // Détection du champion (finale terminée)
    if (final && final.status === "finished" && final.homeScore != null && final.awayScore != null) {
      const winner = final.homeScore > final.awayScore ? final.homeTeam : final.awayTeam
      if (AFRICAN_CODES.includes(winner.code)) {
        setChampionTeam(winner)
      }
    }
  }, [allMatches])

  return {
    allAfricaEliminated,
    hasExtraTeams: extraTeams.length > 0,
    championTeam,
    finalMatch,
    africanTeams,
  }
}
