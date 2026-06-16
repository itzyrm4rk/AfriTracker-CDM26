import type { Metadata } from "next"
import Bracket from "@/components/ui/Bracket"

export const metadata: Metadata = {
  title: "Parcours de Qualification - AfriTracker",
  description: "Arbre des matchs de la Coupe du Monde 2026 — de 1/16 à la Finale.",
}

export default function BracketPage() {
  return (
    <div className="py-8 max-w-full animate-fade-in">
      <div className="flex flex-col gap-2 mb-8 px-4 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-black" style={{ fontFamily: "var(--font-display)" }}>
          Parcours de{" "}
          <span style={{ color: "var(--color-primary-light)" }}>Qualification</span>
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          L'arbre complet de la CdM 2026 — Suis la progression des équipes africaines jusqu'à la finale.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 items-center mb-6 px-4 lg:px-8">
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
        >
          📅 <strong style={{ color: "var(--color-text)" }}>Phase finale</strong> : 28 juin – 19 juillet 2026
        </div>
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", color: "#FCD34D" }}
        >
          🏆 <strong>Finale</strong> : MetLife Stadium, New York · 19 juillet 2026
        </div>
      </div>

      <div className="px-4 lg:px-8">
        <Bracket />
      </div>
    </div>
  )
}
