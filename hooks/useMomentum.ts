"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { isMomentumSeenToday, markMomentumSeen } from "@/lib/storage"
import type { Momentum } from "@/types"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useMomentum() {
  const [dismissed, setDismissed] = useState(false)
  const [seenToday, setSeenToday] = useState(true) // SSR safe: assume seen

  useEffect(() => {
    setSeenToday(isMomentumSeenToday())
  }, [])

  const { data } = useSWR<{ momentum: Momentum | null }>(
    !seenToday && !dismissed ? "/api/momentum" : null,
    fetcher
  )

  const momentum = data?.momentum ?? null
  const isVisible = !seenToday && !dismissed && !!momentum

  const dismiss = () => {
    setDismissed(true)
    markMomentumSeen()
  }

  return { momentum, isVisible, dismiss }
}
