"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import MomentumCard from "@/components/ui/MomentumCard"
import MatchCard from "@/components/ui/MatchCard"
import GroupTable from "@/components/ui/GroupTable"
import AllAfricaEliminatedOverlay from "@/components/ui/special-states/AllAfricaEliminatedOverlay"
import ChampionScreen from "@/components/ui/special-states/ChampionScreen"
import FinalHero from "@/components/ui/special-states/FinalHero"
import { useLiveScores, useUpcomingMatches } from "@/hooks/useLiveScores"
import { useStandings } from "@/hooks/useStandings"
import { useTeams } from "@/hooks/useTeams"
import { useCompetitionState } from "@/hooks/useCompetitionState"
import { Loader2, ArrowRight } from "lucide-react"

export default function Dashboard() {
  const { liveMatches, isLoading: isLoadingLive } = useLiveScores()
  const { upcomingMatches, isLoading: isLoadingUpcoming } = useUpcomingMatches()
  const { groups, isLoading: isLoadingStandings } = useStandings()
  const { allFollowedTeams, africanTeams } = useTeams()
  const { allAfricaEliminated, hasExtraTeams, championTeam, finalMatch } = useCompetitionState()
  const [overlayDismissed, setOverlayDismissed] = useState(false)

  const africanLiveMatches = useMemo(() => {
    return liveMatches.filter(
      m => allFollowedTeams.includes(m.homeTeam.code) || allFollowedTeams.includes(m.awayTeam.code)
    )
  }, [liveMatches, allFollowedTeams])

  const relevantUpcomingMatches = useMemo(() => {
    return upcomingMatches
      .filter(
        m =>
          allFollowedTeams.includes(m.homeTeam.code) ||
          allFollowedTeams.includes(m.awayTeam.code)
      )
      .slice(0, 5)
  }, [upcomingMatches, allFollowedTeams])

  const relevantGroups = useMemo(() => {
    return groups.filter(g =>
      g.teams.some(standing => africanTeams.includes(standing.team.code))
    )
  }, [groups, africanTeams])

  return (
    <div className="space-y-6">
      {championTeam && <ChampionScreen team={championTeam} />}

      {!championTeam && allAfricaEliminated && !overlayDismissed && (
        <AllAfricaEliminatedOverlay
          hasExtraTeams={hasExtraTeams}
          onClose={() => setOverlayDismissed(true)}
        />
      )}

      {finalMatch && finalMatch.status !== "finished" && (
        <FinalHero
          homeTeam={finalMatch.homeTeam}
          awayTeam={finalMatch.awayTeam}
          matchDate={finalMatch.date}
        />
      )}

      <MomentumCard />

      {/* Matchs en direct */}
      {!isLoadingLive && africanLiveMatches.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ background: "var(--color-live)", animation: "pulse-live 1.5s infinite" }}
              />
              En direct
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {africanLiveMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {isLoadingLive && (
        <div className="flex-center py-4">
          <Loader2 className="animate-spin" style={{ color: "var(--color-primary-light)" }} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Prochains Matchs */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Prochains matchs
            </h2>
            <Link
              href="/calendar"
              className="text-sm flex items-center gap-1 hover:underline"
              style={{ color: "var(--color-primary-light)" }}
            >
              Voir tous <ArrowRight size={16} />
            </Link>
          </div>

          {isLoadingUpcoming ? (
            <div className="flex-center py-8">
              <Loader2 className="animate-spin" style={{ color: "var(--color-primary-light)" }} />
            </div>
          ) : relevantUpcomingMatches.length > 0 ? (
            <div className="space-y-4">
              {relevantUpcomingMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
              <Link
                href="/calendar"
                className="block w-full py-3 mt-4 text-center rounded-xl font-medium transition-colors"
                style={{ background: "var(--color-surface-2)", color: "var(--color-text)" }}
              >
                Voir tous les matchs
              </Link>
            </div>
          ) : (
            <div
              className="rounded-xl p-6 text-center"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
            >
              Aucun match à venir pour vos équipes suivies.
            </div>
          )}
        </section>

        {/* Classements Rapides */}
        <section>
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Classements rapides
          </h2>

          {isLoadingStandings ? (
            <div className="flex-center py-8">
              <Loader2 className="animate-spin" style={{ color: "var(--color-primary-light)" }} />
            </div>
          ) : relevantGroups.length > 0 ? (
            <div className="flex flex-col gap-4">
              {relevantGroups.map(group => (
                <GroupTable key={group.name} group={group} />
              ))}
            </div>
          ) : (
            <div
              className="rounded-xl p-6 text-center"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
            >
              Les classements ne sont pas encore disponibles.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
