"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, ArrowRight, Share2, Copy, Check } from "lucide-react"
import type { CompetitionStats } from "@/hooks/useCompetitionState"

interface Props {
  onClose: () => void
  hasExtraTeams: boolean
  africanStats: CompetitionStats
}

export default function AllAfricaEliminatedOverlay({ onClose, hasExtraTeams, africanStats }: Props) {
  const [isVisible, setIsVisible] = useState(true)
  const [copied, setCopied] = useState(false)

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 500)
  }

  const shareText = `🌍 Fin de l'aventure africaine à la Coupe du Monde 2026.\n\nBilan :\n- Matchs joués : ${africanStats.matches}\n- Victoires : ${africanStats.wins}\n- Buts marqués : ${africanStats.goals}\n\nRevivez le parcours sur AfriTracker`

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
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ background: "rgba(8,12,16,0.95)", backdropFilter: "blur(8px)" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="rounded-3xl p-6 md:p-8 max-w-md w-full text-center relative overflow-hidden my-auto"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
          >
            <div className="absolute top-0 left-0 w-full h-2" style={{ background: "var(--color-live)" }} />

            <div
              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 md:mb-6"
              style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
            >
              <Globe style={{ color: "var(--color-text-muted)" }} size={32} />
            </div>

            <h2 className="text-xl md:text-2xl font-black mb-3" style={{ fontFamily: "var(--font-display)" }}>
              L&apos;Afrique a quitté la compétition
            </h2>
            <p className="mb-6 md:mb-8 text-sm md:text-base leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              Toutes les équipes africaines ont été éliminées de cette Coupe du Monde 2026.
              Le rêve s&apos;arrête ici pour cette édition.
            </p>

            <div
              className="rounded-2xl p-4 mb-6 text-left"
              style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
            >
              <h3 className="font-bold text-sm mb-3">Bilan Africain 2026</h3>
              <div className="space-y-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
                <div className="flex justify-between items-center pb-2" style={{ borderBottom: "1px solid rgba(30,45,61,0.5)" }}>
                  <span>Matchs joués</span>
                  <strong style={{ color: "var(--color-text)" }}>{africanStats.matches}</strong>
                </div>
                <div className="flex justify-between items-center pb-2" style={{ borderBottom: "1px solid rgba(30,45,61,0.5)" }}>
                  <span>Total victoires</span>
                  <strong style={{ color: "var(--color-text)" }}>{africanStats.wins}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span>Buts marqués</span>
                  <strong style={{ color: "var(--color-text)" }}>{africanStats.goals}</strong>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <h4
                className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-2"
                style={{ color: "var(--color-text-muted)" }}
              >
                <Share2 size={14} /> Partager le bilan
              </h4>

              <button
                onClick={handleWhatsApp}
                className="w-full font-bold py-2 md:py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-white text-sm md:text-base"
                style={{ background: "#25D366" }}
              >
                WhatsApp
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleTwitter}
                  className="font-bold py-2 md:py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-white text-sm md:text-base"
                  style={{ background: "black", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                  </svg>
                  X
                </button>
                <button
                  onClick={handleCopy}
                  className="font-bold py-2 md:py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm md:text-base"
                  style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
                >
                  {copied ? <Check size={18} style={{ color: "var(--color-success)" }} /> : <Copy size={18} />}
                  {copied ? "Copié !" : "Copier"}
                </button>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-opacity hover:opacity-90 text-white"
              style={{ background: "var(--color-primary)" }}
            >
              {hasExtraTeams ? "Continuer avec mes autres équipes" : "Choisir une autre nation à suivre"}
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
