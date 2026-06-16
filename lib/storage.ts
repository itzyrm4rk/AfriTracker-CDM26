const STORAGE_KEY = "afri-tracker"

interface StorageData {
  african_teams: string[]
  extra_teams: string[]
  onboarding_done: boolean
  momentum_seen_date: string | null
}

const DEFAULT_STORAGE: StorageData = {
  african_teams: ["MAR", "SEN", "ALG", "EGY", "CIV", "GHA", "TUN", "ZAF", "CPV", "COD"],
  extra_teams: [],
  onboarding_done: false,
  momentum_seen_date: null,
}

export function getStorageData(): StorageData {
  if (typeof window === "undefined") return DEFAULT_STORAGE
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? (JSON.parse(data) as StorageData) : DEFAULT_STORAGE
  } catch {
    return DEFAULT_STORAGE
  }
}

export function setStorageData(data: Partial<StorageData>): void {
  if (typeof window === "undefined") return
  const current = getStorageData()
  const updated = { ...current, ...data }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function isOnboardingDone(): boolean {
  return getStorageData().onboarding_done
}

export function isMomentumSeenToday(): boolean {
  const today = new Date().toISOString().split("T")[0]
  return getStorageData().momentum_seen_date === today
}

export function markMomentumSeen(): void {
  const today = new Date().toISOString().split("T")[0]
  setStorageData({ momentum_seen_date: today })
}

export type { StorageData }
