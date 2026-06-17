"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { isMomentumSeenToday, markMomentumSeen, getCachedMomentum, saveCachedMomentum } from "@/lib/storage"
import type { Momentum } from "@/types"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useMomentum() {
  const [dismissed, setDismissed] = useState(false)
  const [seenToday, setSeenToday] = useState(true) // SSR safe: assume seen
  const [localMomentum, setLocalMomentum] = useState<Momentum | null>(null)

  useEffect(() => {
    setSeenToday(isMomentumSeenToday())
    setLocalMomentum(getCachedMomentum())
  }, [])

  // Seulement si on n'a pas vu, pas de momentum local et pas rejeté
  const shouldFetch = !seenToday && !dismissed && !localMomentum

  const { data } = useSWR<{ momentum: Momentum | null }>(
    shouldFetch ? "/api/momentum" : null,
    fetcher
  )

  useEffect(() => {
    if (data?.momentum) {
      saveCachedMomentum(data.momentum)
      setLocalMomentum(data.momentum)
    }
  }, [data])

  const momentum = localMomentum || data?.momentum || null
  const isVisible = !seenToday && !dismissed && !!momentum

  const dismiss = () => {
    setDismissed(true)
    markMomentumSeen()
  }

  return { momentum, isVisible, dismiss }
}
