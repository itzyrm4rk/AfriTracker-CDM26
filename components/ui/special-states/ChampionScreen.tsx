"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Share2, Copy, Check } from "lucide-react"
import type { Team } from "@/types"

interface Props {
  team: Team
  onClose?: () => void
}

export default function ChampionScreen({ team, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }
      const particleCount = 50 * (timeLeft / duration)
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  const shareText = `🏆 HISTORIQUE ! Le ${team.name} ${team.flag} remporte la Coupe du Monde 2026 ! L'Afrique sur le toit du monde 🌍⚽\n\nRevivez le parcours sur AfriTracker`

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank")
  }

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank")
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        style={{ background: "rgba(8,12,16,0.95)", backdropFilter: "blur(4px)" }}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          className="rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden"
          style={{
            background: "var(--color-surface)",
            border: "1px solid rgba(245,158,11,0.3)",
            boxShadow: "0 0 50px rgba(245,158,11,0.15)",
          }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 -z-10"
            style={{ background: "rgba(245,158,11,0.2)", filter: "blur(50px)" }}
          />

          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 transition-colors"
              style={{ color: "var(--color-text-muted)" }}
            >
              ✕
            </button>
          )}

          <div className="mb-6">
            <span className="text-sm font-bold tracking-widest uppercase mb-2 block" style={{ color: "#F59E0B" }}>
              Champion du Monde 2026
            </span>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-9xl drop-shadow-2xl mb-4"
            >
              {team.flag}
            </motion.div>
            <h2 className="text-4xl font-black mb-2" style={{ fontFamily: "var(--font-display)" }}>
              {team.name}
            </h2>
            <p style={{ color: "var(--color-text-muted)" }}>
              L&apos;Afrique entre dans l&apos;histoire en remportant sa première Coupe du Monde.
            </p>
          </div>

          <div className="rounded-2xl p-4 mb-8 text-left" style={{ background: "var(--color-surface-2)" }}>
            <h3 className="font-bold text-sm mb-3">Parcours du Champion</h3>
            <div className="space-y-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              <div className="flex justify-between items-center">
                <span>Matchs joués</span>
                <strong style={{ color: "var(--color-text)" }}>7</strong>
              </div>
              <div className="flex justify-between items-center">
                <span>Buts marqués</span>
                <strong style={{ color: "var(--color-text)" }}>14</strong>
              </div>
              <div className="flex justify-between items-center">
                <span>Statut</span>
                <strong style={{ color: "#FBBF24" }}>Vainqueur</strong>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4
              className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-2"
              style={{ color: "var(--color-text-muted)" }}
            >
              <Share2 size={14} /> Partager l&apos;exploit
            </h4>

            <button
              onClick={handleWhatsApp}
              className="w-full font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-white"
              style={{ background: "#25D366" }}
            >
              Partager sur WhatsApp
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleTwitter}
                className="font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-white"
                style={{ background: "black", border: "1px solid rgba(255,255,255,0.2)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
                X (Twitter)
              </button>
              <button
                onClick={handleCopy}
                className="font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
              >
                {copied ? <Check size={18} style={{ color: "var(--color-success)" }} /> : <Copy size={18} />}
                {copied ? "Copié !" : "Copier"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
