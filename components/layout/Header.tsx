"use client"

import Link from "next/link"
import { Settings } from "lucide-react"
import { useLiveScores } from "@/hooks/useLiveScores"
import { useTeams } from "@/hooks/useTeams"

export default function Header() {
  const { liveMatches } = useLiveScores()
  const { africanTeams } = useTeams()

  const hasAfricanLive = liveMatches.some(
    m => africanTeams.includes(m.homeTeam.code) || africanTeams.includes(m.awayTeam.code)
  )

  return (
    <header
      className="h-16 flex items-center justify-between px-4 sticky top-0 z-10 shrink-0"
      style={{
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <Link href="/" className="flex items-center gap-2">
        <span
          className="text-xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-primary-light)" }}
        >
          🌍 AfriTracker
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {hasAfricanLive && (
          <span
            className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full"
            style={{
              color: "var(--color-live)",
              background: "rgba(211,47,47,0.1)",
              animation: "pulse-live 1.5s infinite",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--color-live)" }}
            />
            LIVE
          </span>
        )}

        <Link
          href="/settings"
          className="p-2 rounded-full transition-colors"
          style={{ color: "var(--color-text-muted)" }}
          aria-label="Paramètres"
        >
          <Settings size={20} />
        </Link>
      </div>
    </header>
  )
}
