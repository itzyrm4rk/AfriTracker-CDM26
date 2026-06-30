"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { motion } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"
import { getBracketRounds, isAfricanTeam, type BracketMatch } from "@/lib/bracket-data"
import { getTeamByCode } from "@/data/teams"
import type { Match } from "@/types"
import { useStandings } from "@/hooks/useStandings"

const fetcher = (url: string) => fetch(url).then(r => r.json())

function formatDate(d: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(d))
}

function BracketCard({
  match,
  africaView,
}: {
  match: BracketMatch
  africaView: boolean
}) {
  const homeTeam = match.homeTeamCode ? getTeamByCode(match.homeTeamCode) : null
  const awayTeam = match.awayTeamCode ? getTeamByCode(match.awayTeamCode) : null

  const hasAfricanTeam =
    (match.homeTeamCode && isAfricanTeam(match.homeTeamCode)) ||
    (match.awayTeamCode && isAfricanTeam(match.awayTeamCode))

  const dimmed = africaView && !hasAfricanTeam

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: dimmed ? 0.3 : 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl p-3 min-w-[220px] shrink-0"
      style={{
        background: hasAfricanTeam ? "rgba(76,175,80,0.08)" : "var(--color-surface)",
        border: `1px solid ${hasAfricanTeam ? "rgba(76,175,80,0.35)" : "var(--color-border)"}`,
      }}
    >
      <div className="flex justify-between items-center text-[10px] mb-2" style={{ color: "var(--color-text-muted)" }}>
        <span className="truncate mr-2">{match.stadium} · {formatDate(match.date)}</span>
        <span className="font-bold px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 shrink-0">
          M{match.matchNumber}
        </span>
      </div>

      {/* Home */}
      <div
        className="flex items-center justify-between px-2 py-1.5 rounded-lg mb-1"
        style={{
          background: homeTeam?.isEliminated ? "rgba(55,65,81,0.3)" : "var(--color-surface-2)",
          textDecoration: homeTeam?.isEliminated ? "line-through" : undefined,
        }}
      >
        <span className="flex items-center gap-2 text-xs font-medium truncate">
          <span className="text-base">{homeTeam?.flag ?? "🏳️"}</span>
          <span className="truncate max-w-[110px]">{homeTeam?.name ?? match.homeLabel}</span>
        </span>
        {match.homeScore != null && (
          <span className="font-bold text-sm">{match.homeScore}</span>
        )}
      </div>

      {/* Away */}
      <div
        className="flex items-center justify-between px-2 py-1.5 rounded-lg"
        style={{
          background: awayTeam?.isEliminated ? "rgba(55,65,81,0.3)" : "var(--color-surface-2)",
          textDecoration: awayTeam?.isEliminated ? "line-through" : undefined,
        }}
      >
        <span className="flex items-center gap-2 text-xs font-medium truncate">
          <span className="text-base">{awayTeam?.flag ?? "🏳️"}</span>
          <span className="truncate max-w-[110px]">{awayTeam?.name ?? match.awayLabel}</span>
        </span>
        {match.awayScore != null && (
          <span className="font-bold text-sm">{match.awayScore}</span>
        )}
      </div>


    </motion.div>
  )
}

export default function Bracket() {
  const [africaView, setAfricaView] = useState(false)
  const { data: matches } = useSWR<Match[]>("/api/matches", fetcher, { revalidateOnFocus: false })
  const { groups } = useStandings()

  const rounds = useMemo(() => {
    const baseRounds = getBracketRounds()
    const resolvedWinners: Record<string, string> = {}
    const resolvedLosers: Record<string, string> = {}

    // Résout un label comme "1er Groupe A", "2e Groupe B", "3e Groupe C/D/F/G/H",
    // "Vainqueur M73", "Perdant SF101" en code d'équipe
    const resolveLabel = (label: string): string | undefined => {
      if (!groups || groups.length === 0) return undefined

      // 1er ou 2e de groupe
      if (label.startsWith("1er Groupe") || label.startsWith("2e Groupe")) {
        const parts = label.split(" ")
        const pos = parts[0] === "1er" ? 0 : 1
        const grpLetter = parts[2] // ex: "A"
        const group = groups.find(g => g.name === `Groupe ${grpLetter}`)
        if (group && group.teams.length > pos && group.teams[pos].played > 0) {
          return group.teams[pos].team.code
        }
        return undefined
      }

      // 3e de groupe — cas ambigu (ex: "3e Groupe C/D/F/G/H")
      // On ne peut pas résoudre automatiquement car ça dépend du tirage FIFA
      // On laisse l'API s'en charger ou on attend que le match soit connu
      if (label.startsWith("3e Groupe")) {
        return undefined
      }

      // Vainqueur d'un match précédent
      if (label.startsWith("Vainqueur")) {
        const ref = label
          .replace("Vainqueur M", "")
          .replace("Vainqueur QF", "")
          .replace("Vainqueur SF", "")
        return resolvedWinners[ref]
      }

      // Perdant d'une demi-finale (pour la petite finale)
      if (label.startsWith("Perdant SF")) {
        const ref = label.replace("Perdant SF", "")
        return resolvedLosers[ref]
      }

      return undefined
    }

    // Itérer tour par tour dans l'ordre pour que la propagation fonctionne
    baseRounds.forEach(round => {
      round.matches.forEach(bm => {
        const expectedHomeCode = resolveLabel(bm.homeLabel)
        const expectedAwayCode = resolveLabel(bm.awayLabel)

        let apiMatch: Match | undefined
        const koMatches = matches
          ? matches.filter(m => m.phase !== "Phase de groupes" && !m.phase.startsWith("Groupe"))
          : []

        // Chercher dans les matchs de l'API par correspondance d'équipes (pas par ID)
        if (expectedHomeCode && expectedAwayCode) {
          apiMatch = koMatches.find(m =>
            (m.homeTeam.code === expectedHomeCode && m.awayTeam.code === expectedAwayCode) ||
            (m.homeTeam.code === expectedAwayCode && m.awayTeam.code === expectedHomeCode)
          )
        }

        // Si un seul côté est résolu (ex: 3e de groupe inconnu), chercher par l'équipe connue
        if (!apiMatch && koMatches.length > 0) {
          const knownCode = expectedHomeCode || expectedAwayCode
          if (knownCode && (!expectedHomeCode || !expectedAwayCode)) {
            apiMatch = koMatches.find(m =>
              m.homeTeam.code === knownCode || m.awayTeam.code === knownCode
            )
          }
        }

        if (apiMatch) {
          bm.homeTeamCode = apiMatch.homeTeam.code
          bm.awayTeamCode = apiMatch.awayTeam.code
          bm.homeScore = apiMatch.homeScore
          bm.awayScore = apiMatch.awayScore

          if (apiMatch.date) bm.date = apiMatch.date
          if (apiMatch.stadium && apiMatch.stadium.name !== "Unknown Stadium") {
            bm.stadium = apiMatch.stadium.name
          }

          // Propager le vainqueur/perdant si le match est terminé
          if (apiMatch.status === "finished" && apiMatch.homeScore != null && apiMatch.awayScore != null) {
            if (apiMatch.homeScore > apiMatch.awayScore) {
              resolvedWinners[bm.matchNumber.toString()] = apiMatch.homeTeam.code
              resolvedLosers[bm.matchNumber.toString()] = apiMatch.awayTeam.code
            } else if (apiMatch.awayScore > apiMatch.homeScore) {
              resolvedWinners[bm.matchNumber.toString()] = apiMatch.awayTeam.code
              resolvedLosers[bm.matchNumber.toString()] = apiMatch.homeTeam.code
            }
          }
        } else {
          // Pas de match trouvé dans l'API → on affiche quand même les équipes résolues
          if (expectedHomeCode) bm.homeTeamCode = expectedHomeCode
          if (expectedAwayCode) bm.awayTeamCode = expectedAwayCode
        }
      })
    })

    return baseRounds
  }, [matches, groups])

  return (
    <div>
      {/* Toggle Vue Afrique */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setAfricaView(!africaView)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors"
          style={{
            background: africaView ? "var(--color-primary)" : "var(--color-surface-2)",
            color: africaView ? "white" : "var(--color-text-muted)",
            border: "1px solid var(--color-border)",
          }}
        >
          {africaView ? <Eye size={16} /> : <EyeOff size={16} />}
          Vue Afrique
        </button>
      </div>

      {/* Bracket scrollable horizontalement */}
      <div className="flex gap-8 overflow-x-auto pb-6 -mx-4 px-4 lg:-mx-8 lg:px-8">
        {rounds.map(round => (
          <div key={round.id} className="flex flex-col gap-4 shrink-0">
            <h3
              className="text-sm font-bold uppercase tracking-wider text-center sticky top-0 py-2"
              style={{ color: "var(--color-primary-light)", fontFamily: "var(--font-display)" }}
            >
              {round.name}
            </h3>
            <div className="flex flex-col gap-4 justify-around flex-1">
              {round.matches.map(match => (
                <BracketCard key={match.id} match={match} africaView={africaView} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
