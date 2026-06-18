"use client"

import { useState, useEffect } from "react"
import { MapPin, CalendarPlus } from "lucide-react"
import type { Match } from "@/types"
import { generateGoogleCalendarLink, generateICSFile } from "@/lib/calendar"

// ─── Sub-components ──────────────────────────────────────────────────────────

function LiveBadge() {
  return (
    <span
      className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
      style={{
        color: "var(--color-live)",
        background: "rgba(211,47,47,0.15)",
        animation: "pulse-live 1.5s infinite",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-live)" }} />
      LIVE
    </span>
  )
}

function Countdown({ targetDateUTC }: { targetDateUTC: string }) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const update = () => {
      const diff = new Date(targetDateUTC).getTime() - Date.now()
      if (diff <= 0) { setTimeLeft("Bientôt"); return }
      const h = Math.floor(diff / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      const s = Math.floor((diff % 60_000) / 1_000)
      setTimeLeft(h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`)
    }
    update()
    const id = setInterval(update, 1_000)
    return () => clearInterval(id)
  }, [targetDateUTC])

  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded-full"
      style={{ color: "var(--color-gold)", background: "rgba(249,168,37,0.1)" }}
    >
      ⏱ {timeLeft}
    </span>
  )
}

// ─── Main MatchCard ───────────────────────────────────────────────────────────

interface Props {
  match: Match
}

export default function MatchCard({ match }: Props) {
  const isLive = match.status === "live"
  const isFinished = match.status === "finished"
  const isUpcoming = match.status === "scheduled"

  const formatTime = (d: string) =>
    new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date(d))

  const formatHour = (d: string) =>
    new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date(d))

  const formatFullDate = (d: string) =>
    new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(d))

  const isStartingSoon = () => {
    const diff = new Date(match.date).getTime() - Date.now()
    return diff > 0 && diff < 3 * 3_600_000
  }

  const handleAddToCalendar = (type: "google" | "apple") => {
    const endDate = new Date(new Date(match.date).getTime() + 2 * 3_600_000).toISOString()
    const title = `${match.homeTeam.flag} ${match.homeTeam.name} vs ${match.awayTeam.name} ${match.awayTeam.flag} · CdM 2026`
    const details = `${match.phase} · ${match.stadium.name}, ${match.stadium.city}`
    const location = `${match.stadium.name}, ${match.stadium.city}, ${match.stadium.country}`

    if (type === "google") {
      window.open(generateGoogleCalendarLink({ title, startDateUTC: match.date, endDateUTC: endDate, details, location }), "_blank")
    } else {
      const ics = generateICSFile({ title, startDateUTC: match.date, endDateUTC: endDate, details, location })
      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = `${match.homeTeam.code}_vs_${match.awayTeam.code}.ics`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  return (
    <div
      className="flex flex-col relative overflow-hidden transition-all"
      style={{
        background: "var(--color-surface)",
        border: `1px solid ${isLive ? "rgba(211,47,47,0.4)" : "var(--color-border)"}`,
        borderRadius: "0.75rem",
        padding: "1rem",
        boxShadow: isLive ? "0 0 20px rgba(211,47,47,0.1)" : undefined,
      }}
    >
      {/* Top bar */}
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 text-xs gap-3 sm:gap-0"
        style={{ color: "var(--color-text-muted)" }}
      >
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="font-semibold uppercase tracking-wider" style={{ color: "var(--color-text)" }}>
            {match.phase}
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1 truncate max-w-[160px] sm:max-w-[200px]">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{match.stadium.name}, {match.stadium.city}</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
            📅 {formatFullDate(match.date)}
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {isLive && <LiveBadge />}
          {isFinished && (
            <span
              className="px-2 py-0.5 rounded text-[10px] uppercase"
              style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}
            >
              Terminé
            </span>
          )}
          {isUpcoming && !isStartingSoon() && (
            <span style={{ color: "var(--color-text)" }}>{formatTime(match.date)}</span>
          )}
          {isUpcoming && isStartingSoon() && <Countdown targetDateUTC={match.date} />}
        </div>
      </div>

      {/* Teams + Score */}
      <div className="flex items-center justify-between mb-2">
        {/* Home */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div
            className="flex items-center justify-center drop-shadow-md h-12 w-16 sm:h-16 sm:w-20"
            style={{ filter: match.homeTeam.isEliminated ? "grayscale(1)" : undefined, opacity: match.homeTeam.isEliminated ? 0.5 : 1 }}
          >
            {match.homeTeam.flagUrl ? (
              <img src={match.homeTeam.flagUrl} alt={match.homeTeam.name} className="max-h-full max-w-full object-contain" loading="lazy" />
            ) : (
              <span className="text-4xl sm:text-5xl">{match.homeTeam.flag}</span>
            )}
          </div>
          <span className="font-bold text-sm sm:text-base text-center line-clamp-2 leading-tight text-balance px-1">
            {match.homeTeam.name}
          </span>
        </div>

        {/* Score */}
        <div className="px-4 flex flex-col items-center justify-center min-w-[100px]">
          {isUpcoming ? (
            <div
              className="text-2xl sm:text-3xl font-bold px-4 py-2 rounded-xl"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-text-muted)",
                background: "var(--color-surface-2)",
              }}
            >
              {formatHour(match.date)}
            </div>
          ) : match.isDataPending ? (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-3 text-3xl sm:text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                <span style={{ color: "var(--color-text-muted)" }}>-</span>
                <span style={{ color: "rgba(100,116,139,0.5)", fontSize: "1.25rem" }}>-</span>
                <span style={{ color: "var(--color-text-muted)" }}>-</span>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 text-3xl sm:text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                <span style={{ color: match.homeScore! > match.awayScore! ? "var(--color-text)" : "var(--color-text-muted)" }}>
                  {match.homeScore ?? 0}
                </span>
                <span style={{ color: "rgba(100,116,139,0.5)", fontSize: "1.25rem" }}>-</span>
                <span style={{ color: match.awayScore! > match.homeScore! ? "var(--color-text)" : "var(--color-text-muted)" }}>
                  {match.awayScore ?? 0}
                </span>
              </div>
              {isLive && match.minute && (
                <span
                  className="text-xs font-bold mt-1"
                  style={{ color: "var(--color-live)", animation: "pulse-live 1.5s infinite" }}
                >
                  {match.minute}&apos;
                </span>
              )}
            </>
          )}
        </div>

        {/* Away */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div
            className="flex items-center justify-center drop-shadow-md h-12 w-16 sm:h-16 sm:w-20"
            style={{ filter: match.awayTeam.isEliminated ? "grayscale(1)" : undefined, opacity: match.awayTeam.isEliminated ? 0.5 : 1 }}
          >
            {match.awayTeam.flagUrl ? (
              <img src={match.awayTeam.flagUrl} alt={match.awayTeam.name} className="max-h-full max-w-full object-contain" loading="lazy" />
            ) : (
              <span className="text-4xl sm:text-5xl">{match.awayTeam.flag}</span>
            )}
          </div>
          <span className="font-bold text-sm sm:text-base text-center line-clamp-2 leading-tight text-balance px-1">
            {match.awayTeam.name}
          </span>
        </div>
      </div>

      {/* Events (live only) */}
      {isLive && match.events.length > 0 && (
        <div
          className="mt-2 pt-2 text-xs flex justify-center gap-4"
          style={{ borderTop: "1px solid rgba(30,45,61,0.5)", color: "var(--color-text-muted)" }}
        >
          {match.events.slice(-2).map((event, i) => (
            <div key={i} className="flex items-center gap-1">
              {event.type === "goal" && <span>⚽</span>}
              {event.type === "red_card" && (
                <span className="inline-block w-2 h-3 rounded-sm" style={{ background: "#ef4444" }} />
              )}
              {event.type === "yellow_card" && (
                <span className="inline-block w-2 h-3 rounded-sm" style={{ background: "#eab308" }} />
              )}
              <span>{event.player} ({event.minute}&apos;)</span>
            </div>
          ))}
        </div>
      )}

      {/* Calendar buttons */}
      {isUpcoming && (
        <div
          className="mt-4 flex justify-center gap-2 pt-3"
          style={{ borderTop: "1px solid rgba(30,45,61,0.5)" }}
        >
          <button
            onClick={() => handleAddToCalendar("google")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={{
              background: "var(--color-surface-2)",
              color: "var(--color-text-muted)",
            }}
          >
            <CalendarPlus size={13} /> Google
          </button>
          <button
            onClick={() => handleAddToCalendar("apple")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={{
              background: "var(--color-surface-2)",
              color: "var(--color-text-muted)",
            }}
          >
            <CalendarPlus size={13} /> Apple
          </button>
        </div>
      )}

      {/* Data Pending Warning */}
      {match.isDataPending && (
        <div
          className="mt-3 py-1.5 text-center text-[10px] sm:text-xs font-semibold rounded-md"
          style={{
            background: "rgba(249,168,37,0.1)",
            color: "var(--color-gold)",
            border: "1px solid rgba(249,168,37,0.2)",
          }}
        >
          Scores momentanément indisponibles
        </div>
      )}
    </div>
  )
}
