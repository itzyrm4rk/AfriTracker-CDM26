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
  if (typeof window === "undefined") return true
  const date = localStorage.getItem("momentum_seen_date")
  const today = new Date().toISOString().split("T")[0]
  return date === today
}

export function markMomentumSeen() {
  if (typeof window !== "undefined") {
    const today = new Date().toISOString().split("T")[0]
    localStorage.setItem("momentum_seen_date", today)
  }
}

export function getCachedMomentum(): any {
  if (typeof window === "undefined") return null
  try {
    const cached = localStorage.getItem("momentum_data")
    if (!cached) return null
    const parsed = JSON.parse(cached)
    const today = new Date().toISOString().split("T")[0]
    if (parsed.date === today) return parsed
    return null
  } catch {
    return null
  }
}

export function saveCachedMomentum(momentum: any) {
  if (typeof window !== "undefined" && momentum) {
    localStorage.setItem("momentum_data", JSON.stringify(momentum))
  }
}

export type { StorageData }
