"use client"

import { useCallback } from "react"
import useSWR from "swr"
import { getStorageData, setStorageData } from "@/lib/storage"
import { AFRICAN_CODES } from "@/data/teams"

const STORAGE_KEY = "afri-tracker-rerender"

export function useTeams() {
  const { data, mutate } = useSWR(STORAGE_KEY, () => getStorageData(), {
    refreshInterval: 0,
    revalidateOnFocus: false,
  })

  const africanTeams = data?.african_teams ?? AFRICAN_CODES
  const extraTeams = data?.extra_teams ?? []
  const allFollowedTeams = [...new Set([...africanTeams, ...extraTeams])]

  const updateExtraTeams = useCallback(
    (teams: string[]) => {
      setStorageData({ extra_teams: teams })
      mutate()
    },
    [mutate]
  )

  return { africanTeams, extraTeams, allFollowedTeams, updateExtraTeams }
}
