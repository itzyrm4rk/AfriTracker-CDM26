"use client"

import { useEffect, useState } from "react"
import { Download } from "lucide-react"

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("pwa_prompt_dismissed")) {
      setIsDismissed(true)
    }

    // Enregistrement du Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {})
      })
    }

    // Capture de l'événement d'installation PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Vérifier si déjà installé
    window.addEventListener("appinstalled", () => {
      setIsInstallable(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") {
      setIsInstallable(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    sessionStorage.setItem("pwa_prompt_dismissed", "true")
  }

  if (!isInstallable || isDismissed) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-fade-in flex items-center gap-2" style={{ background: "var(--color-primary)", borderRadius: "9999px", paddingRight: "8px" }}>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 pl-4 pr-2 py-2 rounded-l-full font-bold text-sm shadow-lg transition-transform active:scale-95"
        style={{ color: "white" }}
      >
        <Download size={16} />
        Installer l&apos;application
      </button>
      <button
        onClick={handleDismiss}
        className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-colors"
        aria-label="Fermer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  )
}
