import type { Metadata } from "next"
import CalendarClient from "@/components/ui/CalendarClient"

export const metadata: Metadata = {
  title: "Calendrier - AfriTracker",
  description: "Le calendrier global de la Coupe du Monde 2026.",
}

export default function CalendarPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-black" style={{ fontFamily: "var(--font-display)" }}>
          Le{" "}
          <span style={{ color: "var(--color-primary-light)" }}>Calendrier</span>
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          Suis les matchs, filtre par équipe ou par phase.
        </p>
      </div>
      <CalendarClient />
    </div>
  )
}
