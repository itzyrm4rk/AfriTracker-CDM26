"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isOnboardingDone } from "@/lib/storage"
import Header from "./Header"
import Sidebar from "./Sidebar"
import BottomNav from "./BottomNav"

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const done = isOnboardingDone()

    if (!done && pathname !== "/onboarding") {
      router.replace("/onboarding")
    } else if (done && pathname === "/onboarding") {
      router.replace("/")
    } else {
      setIsReady(true)
    }
  }, [pathname, router])

  if (!isReady) {
    return (
      <div className="flex-center h-screen" style={{ background: "var(--color-bg)" }}>
        <div className="text-4xl" style={{ animation: "pulse-live 1.5s infinite" }}>
          🌍
        </div>
      </div>
    )
  }

  if (pathname === "/onboarding") {
    return <main className="h-screen" style={{ background: "var(--color-bg)" }}>{children}</main>
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0 relative p-4 md:p-6 flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <footer className="mt-12 pb-4 text-center text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
            Developpé avec ❤️ par <span style={{ color: "var(--color-primary-light)" }}>Marc Didier</span>
          </footer>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
