"use client"

import { motion } from "framer-motion"
import { AFRICAN_TEAMS } from "@/data/teams"

interface Props {
  onNext: () => void
}

export default function OnboardingSplash({ onNext }: Props) {
  const marqueeFlags = [...AFRICAN_TEAMS, ...AFRICAN_TEAMS]

  return (
    <div className="flex flex-col h-full relative overflow-hidden" style={{ background: "var(--color-bg)" }}>
      <div
        className="absolute inset-0 opacity-20 pointer-events-none -z-10"
        style={{
          background: "radial-gradient(ellipse at center, var(--color-primary-light) 0%, transparent 70%)",
        }}
      />

      <div className="flex-1 flex flex-col items-center justify-center z-10 px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-32 h-32 rounded-full flex items-center justify-center mb-8 relative"
          style={{ background: "var(--color-primary)", boxShadow: "0 0 40px rgba(27,94,32,0.5)" }}
        >
          <span className="text-5xl">🌍</span>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: "2px solid var(--color-gold)", opacity: 0.5 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-4xl font-bold text-center mb-4 tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          AfriTracker
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="text-lg text-center max-w-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          Suis l&apos;Afrique jusqu&apos;au bout de la Coupe du Monde 2026 🏆
        </motion.p>
      </div>

      <div className="h-20 sm:h-32 relative overflow-hidden flex items-center shrink-0">
        <div
          className="absolute left-0 top-0 bottom-0 w-16 z-10"
          style={{ background: "linear-gradient(to right, var(--color-bg), transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-16 z-10"
          style={{ background: "linear-gradient(to left, var(--color-bg), transparent)" }}
        />

        <motion.div
          className="flex gap-8 whitespace-nowrap px-4"
          animate={{ x: [0, -1000] }}
          transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 20, ease: "linear" } }}
        >
          {marqueeFlags.map((team, index) => (
            <div key={`${team.id}-${index}`} className="flex flex-col items-center gap-2 opacity-60">
              <span
                className="text-3xl sm:text-4xl transition-all hover:opacity-100 cursor-default"
                style={{ filter: "grayscale(1)" }}
              >
                {team.flagUrl ? <img src={team.flagUrl} alt="" className="h-8 object-contain" /> : team.flag}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="p-4 sm:p-6 flex justify-center pb-8 sm:pb-safe relative z-10 shrink-0">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          onClick={onNext}
          className="w-full max-w-md font-bold py-4 px-8 rounded-full transition-colors outline-none text-white shadow-lg active:scale-95"
          style={{ background: "var(--color-primary)" }}
        >
          Commencer l&apos;aventure
        </motion.button>
      </div>
    </div>
  )
}
