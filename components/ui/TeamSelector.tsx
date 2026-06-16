"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { AFRICAN_TEAMS, NON_AFRICAN_TEAMS, SUGGESTED_EXTRA_TEAMS } from "@/data/teams"

interface Props {
  onComplete: (extraTeams: string[]) => void
}

export default function TeamSelector({ onComplete }: Props) {
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (code: string) => {
    setSelected(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : prev.length < 2
        ? [...prev, code]
        : prev
    )
  }

  const otherTeams = NON_AFRICAN_TEAMS.filter(
    t => !SUGGESTED_EXTRA_TEAMS.some(s => s.code === t.code)
  )

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: "var(--color-bg)" }}>
      <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
        {/* Équipes africaines présélectionnées */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
            🌍 Tes 10 équipes africaines
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
            Déjà sélectionnées — non modifiables
          </p>

          <div className="grid grid-cols-5 gap-2 mb-8">
            {AFRICAN_TEAMS.map(team => (
              <div
                key={team.code}
                className="flex flex-col items-center gap-1 p-2 rounded-xl"
                style={{ background: "rgba(76,175,80,0.12)", border: "1px solid rgba(76,175,80,0.3)" }}
              >
                <span className="text-3xl">{team.flag}</span>
                <span className="text-[10px] font-medium text-center line-clamp-1">{team.code}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sélection nations supplémentaires */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Ajouter 1 ou 2 autres nations
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
            Optionnel — maximum 2 nations · {selected.length}/2 sélectionnées
          </p>

          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-gold)" }}>
            Suggestions
          </p>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {SUGGESTED_EXTRA_TEAMS.map(team => {
              const isSelected = selected.includes(team.code)
              const isDisabled = !isSelected && selected.length >= 2
              return (
                <button
                  key={team.code}
                  onClick={() => toggle(team.code)}
                  disabled={isDisabled}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all relative"
                  style={{
                    background: isSelected ? "rgba(76,175,80,0.15)" : "var(--color-surface-2)",
                    border: `1px solid ${isSelected ? "rgba(76,175,80,0.5)" : "var(--color-border)"}`,
                    opacity: isDisabled ? 0.4 : 1,
                  }}
                >
                  {isSelected && (
                    <span
                      className="absolute top-1 right-1 rounded-full p-0.5"
                      style={{ background: "var(--color-primary-light)" }}
                    >
                      <Check size={10} className="text-white" />
                    </span>
                  )}
                  <span className="text-3xl">{team.flag}</span>
                  <span className="text-xs font-medium text-center line-clamp-1">{team.name}</span>
                </button>
              )
            })}
          </div>

          <details>
            <summary
              className="text-xs font-bold uppercase tracking-wider mb-2 cursor-pointer"
              style={{ color: "var(--color-text-muted)" }}
            >
              Voir toutes les nations →
            </summary>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {otherTeams.map(team => {
                const isSelected = selected.includes(team.code)
                const isDisabled = !isSelected && selected.length >= 2
                return (
                  <button
                    key={team.code}
                    onClick={() => toggle(team.code)}
                    disabled={isDisabled}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all relative"
                    style={{
                      background: isSelected ? "rgba(76,175,80,0.15)" : "var(--color-surface-2)",
                      border: `1px solid ${isSelected ? "rgba(76,175,80,0.5)" : "var(--color-border)"}`,
                      opacity: isDisabled ? 0.4 : 1,
                    }}
                  >
                    {isSelected && (
                      <span
                        className="absolute top-1 right-1 rounded-full p-0.5"
                        style={{ background: "var(--color-primary-light)" }}
                      >
                        <Check size={10} className="text-white" />
                      </span>
                    )}
                    <span className="text-2xl">{team.flag}</span>
                    <span className="text-[10px] font-medium text-center line-clamp-1">{team.name}</span>
                  </button>
                )
              })}
            </div>
          </details>
        </motion.div>
      </div>

      <div className="p-6 flex justify-center pb-safe sticky bottom-0" style={{ background: "var(--color-bg)" }}>
        <button
          onClick={() => onComplete(selected)}
          className="w-full max-w-md font-bold py-4 px-8 rounded-full transition-colors text-white"
          style={{ background: "var(--color-primary)" }}
        >
          Commencer ({selected.length} nation{selected.length !== 1 ? "s" : ""} supplémentaire{selected.length !== 1 ? "s" : ""})
        </button>
      </div>
    </div>
  )
}
