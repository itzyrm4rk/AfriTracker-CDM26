"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Trophy } from "lucide-react"
import type { Team } from "@/types"

interface Props {
  homeTeam: Team
  awayTeam: Team
  matchDate: string
}

export default function FinalHero({ homeTeam, awayTeam, matchDate }: Props) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null)

  useEffect(() => {
    const target = new Date(matchDate).getTime()

    const interval = setInterval(() => {
      const now = Date.now()
      const distance = target - now

      if (distance < 0) {
        clearInterval(interval)
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 })
        return
      }

      setTimeLeft({
        d: Math.floor(distance / 86_400_000),
        h: Math.floor((distance % 86_400_000) / 3_600_000),
        m: Math.floor((distance % 3_600_000) / 60_000),
        s: Math.floor((distance % 60_000) / 1_000),
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [matchDate])

  return (
    <div
      className="relative rounded-3xl overflow-hidden p-8"
      style={{
        background: "linear-gradient(135deg, var(--color-surface), var(--color-surface-2))",
        border: "1px solid rgba(245,158,11,0.3)",
        boxShadow: "0 0 40px rgba(245,158,11,0.1)",
      }}
    >
      <div
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full"
        style={{ background: "rgba(245,158,11,0.2)", filter: "blur(100px)" }}
      />
      <div
        className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full"
        style={{ background: "rgba(245,158,11,0.2)", filter: "blur(100px)" }}
      />

      <div className="relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div
            className="flex items-center gap-2 font-bold uppercase tracking-[0.2em] text-xs mb-2"
            style={{ color: "#F59E0B" }}
          >
            <Trophy size={14} /> La Grande Finale
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
            <MapPin size={12} /> MetLife Stadium, New York / New Jersey
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 max-w-2xl mx-auto">
          <div className="flex flex-col items-center flex-1">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
              className="text-8xl md:text-9xl drop-shadow-2xl mb-4"
            >
              {homeTeam.flag}
            </motion.div>
            <h3 className="font-black text-2xl md:text-3xl text-center" style={{ fontFamily: "var(--font-display)" }}>
              {homeTeam.name}
            </h3>
          </div>

          <div className="flex flex-col items-center shrink-0">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center font-black italic text-xl md:text-2xl"
              style={{ background: "rgba(245,158,11,0.2)", color: "#F59E0B" }}
            >
              VS
            </motion.div>
          </div>

          <div className="flex flex-col items-center flex-1">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
              className="text-8xl md:text-9xl drop-shadow-2xl mb-4"
            >
              {awayTeam.flag}
            </motion.div>
            <h3 className="font-black text-2xl md:text-3xl text-center" style={{ fontFamily: "var(--font-display)" }}>
              {awayTeam.name}
            </h3>
          </div>
        </div>

        {timeLeft && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex justify-center gap-3 md:gap-6"
          >
            {[
              { label: "Jours", value: timeLeft.d },
              { label: "Heures", value: timeLeft.h },
              { label: "Minutes", value: timeLeft.m },
              { label: "Secondes", value: timeLeft.s },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center">
                <div
                  className="w-14 md:w-18 h-14 md:h-18 rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black"
                  style={{
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {String(item.value).padStart(2, "0")}
                </div>
                <span className="text-[10px] uppercase mt-1.5 tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
