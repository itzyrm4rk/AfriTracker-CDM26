"use client"

import Link from "next/link"
import type { Group } from "@/types"

interface Props {
  group: Group
  highlightTeam?: string
  detailed?: boolean
}

export default function GroupTable({ group, highlightTeam, detailed = false }: Props) {
  return (
    <div>
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <h3 className="font-bold text-sm" style={{ color: "var(--color-text-muted)" }}>
          Groupe {group.name}
        </h3>
        {!detailed && (
          <Link
            href={`/teams`}
            className="text-xs hover:underline"
            style={{ color: "var(--color-primary-light)" }}
          >
            Voir tout →
          </Link>
        )}
      </div>

      {group.isDataPending && (
        <div
          className="mx-4 mb-2 py-1 px-2 text-center text-[10px] sm:text-xs font-semibold rounded"
          style={{
            background: "rgba(249,168,37,0.1)",
            color: "var(--color-gold)",
            border: "1px solid rgba(249,168,37,0.2)",
          }}
        >
          Classement momentanément non actualisé
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}>
              <th className="text-left px-3 py-2 font-medium">#</th>
              <th className="text-left px-3 py-2 font-medium">Équipe</th>
              <th className="px-2 py-2 font-medium text-center">J</th>
              {detailed && (
                <>
                  <th className="px-2 py-2 font-medium text-center">G</th>
                  <th className="px-2 py-2 font-medium text-center">N</th>
                  <th className="px-2 py-2 font-medium text-center">D</th>
                  <th className="px-2 py-2 font-medium text-center">BP</th>
                  <th className="px-2 py-2 font-medium text-center">BC</th>
                  <th className="px-2 py-2 font-medium text-center">Diff</th>
                </>
              )}
              <th className="px-3 py-2 font-medium text-center">Pts</th>
            </tr>
          </thead>
          <tbody>
            {group.teams.map(standing => {
              const isHighlighted = highlightTeam === standing.team.code
              const isQualified = standing.position <= 2

              return (
                <tr
                  key={standing.team.code}
                  style={{
                    background: isHighlighted
                      ? "rgba(76,175,80,0.15)"
                      : "transparent",
                    borderBottom: "1px solid rgba(30,45,61,0.5)",
                    borderLeft: isHighlighted
                      ? "2px solid var(--color-primary-light)"
                      : "2px solid transparent",
                    opacity: standing.team.isEliminated ? 0.5 : 1,
                    filter: standing.team.isEliminated ? "grayscale(100%)" : "none",
                  }}
                >
                  <td className="px-3 py-2" style={{ color: isQualified ? "var(--color-primary-light)" : "var(--color-text-muted)" }}>
                    {standing.position}
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/teams/${standing.team.code}`}
                      className="flex items-center gap-2 hover:underline"
                    >
                      {standing.team.flagUrl ? (
                        <img 
                          src={standing.team.flagUrl} 
                          alt={standing.team.code} 
                          className="w-5 h-auto object-contain shadow-sm rounded-sm" 
                          loading="lazy" 
                        />
                      ) : (
                        <span className="text-base">{standing.team.flag}</span>
                      )}
                      <span className="font-medium truncate max-w-[80px] sm:max-w-none">
                        {standing.team.name}
                      </span>
                      {standing.team.isEliminated && (
                        <span className="text-[10px]" style={{ color: "var(--color-live)" }}>✕</span>
                      )}
                    </Link>
                  </td>
                  <td className="px-2 py-2 text-center" style={{ color: "var(--color-text-muted)" }}>
                    {standing.played}
                  </td>
                  {detailed && (
                    <>
                      <td className="px-2 py-2 text-center" style={{ color: "var(--color-text-muted)" }}>{standing.won}</td>
                      <td className="px-2 py-2 text-center" style={{ color: "var(--color-text-muted)" }}>{standing.drawn}</td>
                      <td className="px-2 py-2 text-center" style={{ color: "var(--color-text-muted)" }}>{standing.lost}</td>
                      <td className="px-2 py-2 text-center" style={{ color: "var(--color-text-muted)" }}>{standing.goalsFor}</td>
                      <td className="px-2 py-2 text-center" style={{ color: "var(--color-text-muted)" }}>{standing.goalsAgainst}</td>
                      <td className="px-2 py-2 text-center" style={{ color: standing.goalDifference > 0 ? "var(--color-success)" : standing.goalDifference < 0 ? "var(--color-live)" : "var(--color-text-muted)" }}>
                        {standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}
                      </td>
                    </>
                  )}
                  <td className="px-3 py-2 text-center font-bold" style={{ color: "var(--color-text)" }}>
                    {standing.points}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
