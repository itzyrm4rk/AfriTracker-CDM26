"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { motion } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"
import { getBracketRounds, isAfricanTeam, type BracketMatch } from "@/lib/bracket-data"
import { getTeamByCode } from "@/data/teams"
import type { Match } from "@/types"

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
      <div className="text-[10px] mb-2" style={{ color: "var(--color-text-muted)" }}>
        {match.stadium} · {formatDate(match.date)}
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

      {!match.homeScore && !match.awayScore && (
        <div className="text-center text-[10px] mt-1.5 font-bold uppercase tracking-wider" style={{ color: "var(--color-gold)" }}>
          TBD
        </div>
      )}
    </motion.div>
  )
}

export default function Bracket() {
  const [africaView, setAfricaView] = useState(false)
  const { data: matches } = useSWR<Match[]>("/api/matches", fetcher, { revalidateOnFocus: false })

  const rounds = useMemo(() => {
    const baseRounds = getBracketRounds()

    // Tentative de matching avec les vraies données API (par phase)
    if (matches) {
      baseRounds.forEach(round => {
        round.matches.forEach(bm => {
          const apiMatch = matches.find(m => m.id.toString() === bm.id)

          if (apiMatch) {
            bm.homeTeamCode = apiMatch.homeTeam?.code
            bm.awayTeamCode = apiMatch.awayTeam?.code
            bm.homeScore = apiMatch.homeScore
            bm.awayScore = apiMatch.awayScore
            
            // On met à jour avec les vraies données de l'API si elles existent
            if (apiMatch.date) bm.date = apiMatch.date
            if (apiMatch.stadium && apiMatch.stadium.name !== "Unknown Stadium") {
              bm.stadium = apiMatch.stadium.name
            }
          }
        })
      })
    }

    return baseRounds
  }, [matches])

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
