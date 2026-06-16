"use client"

interface Props {
  phase: string
}

export default function EliminatedBanner({ phase }: Props) {
  return (
    <div
      className="mb-6 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider"
      style={{
        background: "rgba(211,47,47,0.12)",
        color: "var(--color-live)",
        border: "1px solid rgba(211,47,47,0.3)",
      }}
    >
      ❌ Éliminée · {phase}
    </div>
  )
}
