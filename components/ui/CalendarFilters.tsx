"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Filter, ChevronDown } from "lucide-react"
import { ALL_TEAMS, AFRICAN_CODES } from "@/data/teams"

export default function CalendarFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [showTeamPicker, setShowTeamPicker] = useState(false)

  const phaseFilter = searchParams.get("phase") || "all"
  const showPast = searchParams.get("past") === "true"
  const selectedTeams = searchParams.get("teams")?.split(",").filter(Boolean) || []

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null || value === "") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  const toggleTeam = (code: string) => {
    const next = selectedTeams.includes(code)
      ? selectedTeams.filter(c => c !== code)
      : [...selectedTeams, code]
    updateParam("teams", next.length > 0 ? next.join(",") : null)
  }

  const allAfricaSelected = AFRICAN_CODES.every(c => selectedTeams.includes(c))

  const toggleAfricaFilter = () => {
    if (allAfricaSelected) {
      // Retirer toutes les africaines
      const next = selectedTeams.filter(c => !AFRICAN_CODES.includes(c))
      updateParam("teams", next.length > 0 ? next.join(",") : null)
    } else {
      // Ajouter toutes les africaines (sans doublons)
      const next = [...new Set([...selectedTeams, ...AFRICAN_CODES])]
      updateParam("teams", next.join(","))
    }
  }

  const clearAllTeams = () => {
    updateParam("teams", null)
  }

  return (
    <div className="mb-6 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 text-sm font-medium mr-2" style={{ color: "var(--color-text-muted)" }}>
          <Filter size={16} /> Filtres
        </div>

        {/* Phase */}
        <div className="flex rounded-full overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
          {[
            { value: "all", label: "Tout" },
            { value: "group", label: "Groupes" },
            { value: "knockout", label: "Élimination" },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => updateParam("phase", opt.value === "all" ? null : opt.value)}
              className="px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                background: phaseFilter === opt.value ? "var(--color-primary)" : "transparent",
                color: phaseFilter === opt.value ? "white" : "var(--color-text-muted)",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Past toggle */}
        <button
          onClick={() => updateParam("past", showPast ? null : "true")}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
          style={{
            background: showPast ? "var(--color-primary)" : "var(--color-surface-2)",
            color: showPast ? "white" : "var(--color-text-muted)",
            border: "1px solid var(--color-border)",
          }}
        >
          Matchs passés
        </button>

        {/* 🌍 Afrique quick filter */}
        <button
          onClick={toggleAfricaFilter}
          className="px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
          style={{
            background: allAfricaSelected ? "rgba(76,175,80,0.2)" : "var(--color-surface-2)",
            color: allAfricaSelected ? "var(--color-primary-light)" : "var(--color-text-muted)",
            border: `1px solid ${allAfricaSelected ? "rgba(76,175,80,0.5)" : "var(--color-border)"}`,
          }}
        >
          🌍 Afrique
        </button>

        {/* Team picker toggle */}
        <button
          onClick={() => setShowTeamPicker(!showTeamPicker)}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1"
          style={{
            background: selectedTeams.length > 0 ? "var(--color-primary)" : "var(--color-surface-2)",
            color: selectedTeams.length > 0 ? "white" : "var(--color-text-muted)",
            border: "1px solid var(--color-border)",
          }}
        >
          Équipes {selectedTeams.length > 0 && `(${selectedTeams.length})`}
          <ChevronDown size={12} />
        </button>
      </div>

      {showTeamPicker && (
        <div
          className="p-3 rounded-xl"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          {/* Header du picker */}
          {selectedTeams.length > 0 && (
            <div className="flex justify-end mb-2">
              <button
                onClick={clearAllTeams}
                className="text-[10px] font-medium px-2.5 py-1 rounded-full transition-colors"
                style={{ color: "var(--color-primary-light)", background: "rgba(76,175,80,0.1)" }}
              >
                Tout effacer
              </button>
            </div>
          )}

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {ALL_TEAMS.map(team => {
              const isSelected = selectedTeams.includes(team.code)
              return (
                <button
                  key={team.code}
                  onClick={() => toggleTeam(team.code)}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
                  style={{
                    background: isSelected ? "rgba(76,175,80,0.15)" : "transparent",
                    border: `1px solid ${isSelected ? "rgba(76,175,80,0.5)" : "transparent"}`,
                  }}
                >
                  <span className="text-xl">{team.flag}</span>
                  <span className="text-[9px] font-medium">{team.code}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
