"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import type { TeamData } from "@/data/teams"

interface Props {
  team: TeamData
  index: number
}

export default function TeamCard({ team, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/teams/${team.code}`} className="block h-full group">
        <div
          className="h-full flex flex-col relative overflow-hidden transition-all duration-300 rounded-xl p-4"
          style={{
            background: "var(--color-surface)",
            border: `1px solid ${team.isAfrican && !team.isEliminated ? "rgba(76,175,80,0.3)" : "var(--color-border)"}`,
            filter: team.isEliminated ? "grayscale(0.8)" : undefined,
            opacity: team.isEliminated ? 0.7 : 1,
          }}
        >
          {/* Badge Groupe */}
          <div
            className="absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold"
            style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}
          >
            Gr. {team.group}
          </div>

          {/* Badge Statut */}
          {team.isEliminated && (
            <div
              className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"
              style={{ color: "var(--color-live)", background: "rgba(211,47,47,0.1)" }}
            >
              <span>✕</span>
              <span>OUT</span>
            </div>
          )}

          <div className="flex-1 flex flex-col items-center justify-center py-6">
            <div
              className="flex items-center justify-center mb-4 transition-transform duration-300 drop-shadow-lg group-hover:scale-110 h-16 w-24 sm:h-20 sm:w-28"
            >
              {team.flagUrl ? (
                <img src={team.flagUrl} alt={team.name} className="max-h-full max-w-full object-contain" loading="lazy" />
              ) : (
                <span className="text-6xl sm:text-7xl">{team.flag}</span>
              )}
            </div>
            <h3
              className="font-bold text-lg sm:text-xl text-center px-2 line-clamp-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {team.name}
            </h3>
            {team.isAfrican && !team.isEliminated && (
              <span
                className="mt-2 text-[10px] uppercase font-bold tracking-widest"
                style={{ color: "var(--color-primary-light)" }}
              >
                Afrique
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
