"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Share2 } from "lucide-react"
import { useMomentum } from "@/hooks/useMomentum"

import { toast } from "sonner"

export default function MomentumCard() {
  const { momentum, isVisible, dismiss } = useMomentum()

  const handleShare = async () => {
    if (!momentum) return
    const textToShare = `🌍 Momentum CdM 2026 :\n\n${momentum.text}\n\nVia AfriTracker`
    if (navigator.share) {
      try {
        await navigator.share({ title: "AfriTracker Momentum", text: textToShare })
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(textToShare)
      toast.success("Momentum copié dans le presse-papiers !")
    }
  }

  return (
    <AnimatePresence>
      {isVisible && momentum && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0, overflow: "hidden" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="mb-6"
        >
          <div
            className="rounded-2xl p-5 relative"
            style={{
              background: "linear-gradient(135deg, rgba(27,94,32,0.2), var(--color-surface))",
              border: "1px solid rgba(76,175,80,0.3)",
              boxShadow: "0 4px 24px -8px rgba(27,94,32,0.3)",
            }}
          >
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 p-1 transition-colors"
              style={{ color: "var(--color-text-muted)" }}
              aria-label="Fermer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">⚡</span>
              <h3 className="font-bold text-lg" style={{ fontFamily: "var(--font-display)", color: "var(--color-primary-light)" }}>
                Momentum du jour
              </h3>
            </div>

            <p className="text-sm md:text-base leading-relaxed mb-4 italic" style={{ color: "rgba(240,244,248,0.9)" }}>
              &ldquo;{momentum.text}&rdquo;
            </p>

            <div className="flex justify-end">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                style={{
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-muted)",
                }}
              >
                <Share2 size={14} />
                Partager
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
