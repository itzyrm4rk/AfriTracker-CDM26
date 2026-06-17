export function formatMatchTime(utcDateString: string): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(utcDateString))
}

export function formatMatchHour(utcDateString: string): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(utcDateString))
}

export function formatShortDate(utcDateString: string): string {
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
  }).format(new Date(utcDateString))
}

// ─── Server-side : Jour calendaire africain ──────────────────────────────────

const AFRICA_TZ = "Africa/Douala" // UTC+1, fuseau de référence pour l'audience

/** Retourne la date d'aujourd'hui au format YYYY-MM-DD dans le fuseau africain */
export function getTodayDateInAfrica(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: AFRICA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date()) // format "en-CA" donne YYYY-MM-DD
}

/** Vérifie si un match (date ISO) tombe sur le jour calendaire africain donné */
export function isMatchOnAfricanDate(matchDateISO: string, africanDate: string): boolean {
  const matchLocalDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: AFRICA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(matchDateISO))
  return matchLocalDate === africanDate
}

