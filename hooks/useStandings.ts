"use client"

import useSWR from "swr"
import type { Group } from "@/types"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useStandings() {
  const { data, isLoading, error } = useSWR<Group[]>("/api/standings", fetcher, {
    refreshInterval: 120_000, // 2 minutes
    revalidateOnFocus: false,
  })

  return {
    groups: data ?? [],
    isLoading,
    error,
  }
}
