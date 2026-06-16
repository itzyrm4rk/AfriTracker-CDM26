"use client"

import { useState } from "react"
import { setStorageData } from "@/lib/storage"
import { useTeams } from "@/hooks/useTeams"
import { AFRICAN_TEAMS, NON_AFRICAN_TEAMS } from "@/data/teams"
import { Settings, Trash2, CheckCircle } from "lucide-react"

export default function SettingsPage() {
  const { extraTeams, updateExtraTeams } = useTeams()
  const [selected, setSelected] = useState<string[]>(extraTeams)
  const [saved, setSaved] = useState(false)

  const toggle = (code: string) => {
    setSelected(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : prev.length < 2
        ? [...prev, code]
        : prev
    )
    setSaved(false)
  }

  const handleSave = () => {
    updateExtraTeams(selected)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    if (confirm("Réinitialiser l'onboarding ? Tu devras le refaire au prochain chargement.")) {
      setStorageData({ onboarding_done: false })
      window.location.href = "/onboarding"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <Settings size={28} style={{ color: "var(--color-primary-light)" }} />
        <h1 className="text-3xl font-black" style={{ fontFamily: "var(--font-display)" }}>
          Paramètres
        </h1>
      </div>

      {/* Équipes africaines (non modifiables) */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
          Équipes africaines suivies
        </h2>
        <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
          Les 10 équipes africaines sont toujours suivies automatiquement.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {AFRICAN_TEAMS.map(t => (
            <div
              key={t.code}
              className="flex items-center gap-3 px-3 py-2 rounded-xl"
              style={{ background: "rgba(76,175,80,0.1)", border: "1px solid rgba(76,175,80,0.3)" }}
            >
              <span className="text-2xl">{t.flag}</span>
              <span className="font-medium text-sm">{t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Nations supplémentaires */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>
          Nations supplémentaires
        </h2>
        <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
          Choisis jusqu'à 2 autres nations à suivre.{" "}
          <strong style={{ color: "var(--color-text)" }}>{selected.length}/2 sélectionnées</strong>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {NON_AFRICAN_TEAMS.slice(0, 30).map(t => {
            const isSelected = selected.includes(t.code)
            const isDisabled = !isSelected && selected.length >= 2
            return (
              <button
                key={t.code}
                onClick={() => toggle(t.code)}
                disabled={isDisabled}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-left text-sm transition-all"
                style={{
                  background: isSelected
                    ? "rgba(76,175,80,0.15)"
                    : "var(--color-surface-2)",
                  border: `1px solid ${isSelected ? "rgba(76,175,80,0.5)" : "var(--color-border)"}`,
                  opacity: isDisabled ? 0.4 : 1,
                  cursor: isDisabled ? "not-allowed" : "pointer",
                }}
              >
                <span className="text-xl">{t.flag}</span>
                <span className="font-medium truncate">{t.name}</span>
                {isSelected && (
                  <CheckCircle
                    size={14}
                    className="ml-auto shrink-0"
                    style={{ color: "var(--color-primary-light)" }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </section>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 py-3 rounded-xl font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: saved ? "var(--color-success)" : "var(--color-primary)" }}
        >
          {saved ? "✓ Sauvegardé !" : "Sauvegarder"}
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
          style={{
            background: "var(--color-surface-2)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-muted)",
          }}
        >
          <Trash2 size={18} />
          Réinitialiser
        </button>
      </div>
    </div>
  )
}
