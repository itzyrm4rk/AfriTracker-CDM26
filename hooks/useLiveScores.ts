"use client"

import useSWR from "swr"
import type { Match } from "@/types"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useLiveScores() {
  const { data, isLoading, error } = useSWR<Match[]>("/api/scores", fetcher, {
    refreshInterval: 60_000, // 60 secondes
    revalidateOnFocus: true,
  })

  return {
    liveMatches: (data ?? []).filter(m => m.status === "live"),
    isLoading,
    error,
  }
}

export function useUpcomingMatches() {
  const { data, isLoading, error } = useSWR<Match[]>("/api/matches", fetcher, {
    refreshInterval: 300_000, // 5 minutes
    revalidateOnFocus: false,
  })

  const now = new Date()

  return {
    upcomingMatches: (data ?? [])
      .filter(m => {
        const matchDate = new Date(m.date)
        return m.status === "scheduled" && matchDate > now
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    allMatches: data ?? [],
    isLoading,
    error,
  }
}
