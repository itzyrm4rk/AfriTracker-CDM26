"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { motion } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"
import { getBracketRounds, isAfricanTeam, type BracketMatch } from "@/lib/bracket-data"
import { getTeamByCode } from "@/data/teams"
import type { Match, Group } from "@/types"
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

/** Résout un label statique du bracket en code d'équipe FIFA */
function resolveLabel(label: string, groups: Group[]): string | undefined {
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

  // 3e de groupe — cas ambigu, on laisse l'API s'en charger
  if (label.startsWith("3e Groupe")) {
    return undefined
  }

  // Vainqueur / Perdant — on ne propage plus manuellement,
  // c'est l'API qui gère les tours suivants
  return undefined
}

function BracketCard({
  match,
  africaView,
  eliminatedCodes,
}: {
  match: BracketMatch
  africaView: boolean
  eliminatedCodes: Set<string>
}) {
  const homeTeam = match.homeTeamCode ? getTeamByCode(match.homeTeamCode) : null
  const awayTeam = match.awayTeamCode ? getTeamByCode(match.awayTeamCode) : null

  // Utiliser les eliminatedCodes dynamiques du bracket (pas les données statiques)
  const homeEliminated = match.homeTeamCode ? eliminatedCodes.has(match.homeTeamCode) : false
  const awayEliminated = match.awayTeamCode ? eliminatedCodes.has(match.awayTeamCode) : false

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
          background: homeEliminated ? "rgba(55,65,81,0.3)" : "var(--color-surface-2)",
          opacity: homeEliminated ? 0.5 : 1,
        }}
      >
        <span
          className="flex items-center gap-2 text-xs font-medium truncate"
          style={{ textDecoration: homeEliminated ? "line-through" : undefined }}
        >
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
          background: awayEliminated ? "rgba(55,65,81,0.3)" : "var(--color-surface-2)",
          opacity: awayEliminated ? 0.5 : 1,
        }}
      >
        <span
          className="flex items-center gap-2 text-xs font-medium truncate"
          style={{ textDecoration: awayEliminated ? "line-through" : undefined }}
        >
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

  const resolvedData = useMemo(() => {
    const baseRounds = getBracketRounds()
    const usedApiMatchIds = new Set<string>()
    const eliminatedCodes = new Set<string>()

    // Séparer les matchs KO de l'API
    const koMatches = matches
      ? matches.filter(m => m.phase !== "Phase de groupes" && !m.phase.startsWith("Groupe"))
      : []

    // Itérer tour par tour dans l'ordre
    baseRounds.forEach(round => {
      round.matches.forEach(bm => {
        const expectedHomeCode = resolveLabel(bm.homeLabel, groups || [])
        const expectedAwayCode = resolveLabel(bm.awayLabel, groups || [])

        let apiMatch: Match | undefined

        // 1. Chercher par matchNumber direct (le plus fiable)
        apiMatch = koMatches.find(m => {
          return m.matchNumber === bm.matchNumber && !usedApiMatchIds.has(m.id.toString())
        })

        // 2. Fallback : chercher par paire d'équipes (les deux doivent correspondre)
        if (!apiMatch && expectedHomeCode && expectedAwayCode) {
          apiMatch = koMatches.find(m =>
            !usedApiMatchIds.has(m.id.toString()) &&
            ((m.homeTeam.code === expectedHomeCode && m.awayTeam.code === expectedAwayCode) ||
             (m.homeTeam.code === expectedAwayCode && m.awayTeam.code === expectedHomeCode))
          )
        }

        // 3. Fallback prudent : chercher par UNE seule équipe connue
        //    SEULEMENT pour les 1/16 de finale (r32) où les 3e de groupe sont inconnus
        if (!apiMatch && bm.round === "r32" && koMatches.length > 0) {
          const knownCode = expectedHomeCode || expectedAwayCode
          if (knownCode && (!expectedHomeCode || !expectedAwayCode)) {
            apiMatch = koMatches.find(m =>
              !usedApiMatchIds.has(m.id.toString()) &&
              (m.homeTeam.code === knownCode || m.awayTeam.code === knownCode)
            )
          }
        }

        if (apiMatch) {
          usedApiMatchIds.add(apiMatch.id.toString())
          bm.homeTeamCode = apiMatch.homeTeam.code
          bm.awayTeamCode = apiMatch.awayTeam.code
          bm.homeScore = apiMatch.homeScore
          bm.awayScore = apiMatch.awayScore
          bm.status = apiMatch.status

          if (apiMatch.date) bm.date = apiMatch.date
          if (apiMatch.stadium && apiMatch.stadium.name !== "Unknown Stadium") {
            bm.stadium = apiMatch.stadium.name
          }

          // Collecter les éliminés pour ce bracket
          if (apiMatch.status === "finished" && apiMatch.homeScore != null && apiMatch.awayScore != null) {
            if (apiMatch.homeScore > apiMatch.awayScore) {
              eliminatedCodes.add(apiMatch.awayTeam.code)
            } else if (apiMatch.awayScore > apiMatch.homeScore) {
              eliminatedCodes.add(apiMatch.homeTeam.code)
            }
          }
        } else {
          // Pas de match trouvé dans l'API → on affiche les équipes résolues (sans score)
          if (expectedHomeCode) bm.homeTeamCode = expectedHomeCode
          if (expectedAwayCode) bm.awayTeamCode = expectedAwayCode
        }
      })
    })

    return { rounds: baseRounds, eliminatedCodes }
  }, [matches, groups])

  const rounds = resolvedData.rounds
  const bracketEliminatedCodes = resolvedData.eliminatedCodes

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
                <BracketCard
                  key={match.id}
                  match={match}
                  africaView={africaView}
                  eliminatedCodes={bracketEliminatedCodes}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
