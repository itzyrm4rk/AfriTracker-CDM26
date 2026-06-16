"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, ArrowRight } from "lucide-react"

interface Props {
  onClose: () => void
  hasExtraTeams: boolean
}

export default function AllAfricaEliminatedOverlay({ onClose, hasExtraTeams }: Props) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 500)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(8,12,16,0.95)", backdropFilter: "blur(8px)" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
          >
            <div className="absolute top-0 left-0 w-full h-2" style={{ background: "var(--color-live)" }} />

            <div
              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6"
              style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
            >
              <Globe style={{ color: "var(--color-text-muted)" }} size={32} />
            </div>

            <h2 className="text-2xl font-black mb-3" style={{ fontFamily: "var(--font-display)" }}>
              L&apos;Afrique a quitté la compétition
            </h2>
            <p className="mb-8 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              Toutes les équipes africaines ont été éliminées de cette Coupe du Monde 2026.
              Le rêve s&apos;arrête ici pour cette édition.
            </p>

            <div
              className="rounded-2xl p-4 mb-8 text-left"
              style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
            >
              <h3 className="font-bold text-sm mb-3">Bilan Africain 2026</h3>
              <div className="space-y-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
                <div className="flex justify-between items-center pb-2" style={{ borderBottom: "1px solid rgba(30,45,61,0.5)" }}>
                  <span>Meilleur parcours</span>
                  <strong style={{ color: "var(--color-text)" }}>Sénégal 🇸🇳 (1/4)</strong>
                </div>
                <div className="flex justify-between items-center pb-2" style={{ borderBottom: "1px solid rgba(30,45,61,0.5)" }}>
                  <span>Total victoires</span>
                  <strong style={{ color: "var(--color-text)" }}>14</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span>Buts marqués</span>
                  <strong style={{ color: "var(--color-text)" }}>32</strong>
                </div>
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
