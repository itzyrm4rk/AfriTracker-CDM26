"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import OnboardingSplash from "@/components/ui/OnboardingSplash"
import TeamSelector from "@/components/ui/TeamSelector"
import { setStorageData } from "@/lib/storage"
import { useTeams } from "@/hooks/useTeams"

type OnboardingStep = "splash" | "teams"

export default function OnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>("splash")
  const { updateExtraTeams } = useTeams()

  const handleNext = () => setStep("teams")

  const handleComplete = (extraTeams: string[]) => {
    updateExtraTeams(extraTeams)
    setStorageData({ onboarding_done: true })
    window.location.href = "/"
  }

  return (
    <div className="h-full relative overflow-hidden" style={{ background: "var(--color-bg)" }}>
      <AnimatePresence mode="wait">
        {step === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
            className="h-full absolute inset-0"
          >
            <OnboardingSplash onNext={handleNext} />
          </motion.div>
        )}

        {step === "teams" && (
          <motion.div
            key="teams"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full absolute inset-0"
          >
            <TeamSelector onComplete={handleComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
