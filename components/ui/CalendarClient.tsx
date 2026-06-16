"use client"

import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import useSWR from "swr"
import { Loader2 } from "lucide-react"
import CalendarFilters from "./CalendarFilters"
import MatchCard from "./MatchCard"
import Pagination from "./Pagination"
import type { Match } from "@/types"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function CalendarClient() {
  const searchParams = useSearchParams()
  const { data: allMatches, isLoading } = useSWR<Match[]>("/api/matches", fetcher, {
    revalidateOnFocus: false,
  })

  const currentPage = Number(searchParams.get("page")) || 1
  const itemsPerPage = 10
  const showPast = searchParams.get("past") === "true"
  const phaseFilter = searchParams.get("phase") || "all"
  const teamsFilter = searchParams.get("teams")?.split(",").filter(Boolean) || []

  const filteredMatches = useMemo(() => {
    if (!allMatches) return []

    const now = new Date()
    now.setHours(0, 0, 0, 0)

    return allMatches.filter(match => {
      if (!showPast) {
        const matchDate = new Date(match.date)
        if (matchDate < now && match.status === "finished") return false
      }

      if (phaseFilter === "group" && !match.phase.toLowerCase().includes("groupe")) return false
      if (phaseFilter === "knockout" && match.phase.toLowerCase().includes("groupe")) return false

      if (teamsFilter.length > 0) {
        const isHome = teamsFilter.includes(match.homeTeam.code)
        const isAway = teamsFilter.includes(match.awayTeam.code)
        if (!isHome && !isAway) return false
      }

      return true
    })
  }, [allMatches, showPast, phaseFilter, teamsFilter])

  const totalPages = Math.ceil(filteredMatches.length / itemsPerPage)
  const currentMatches = filteredMatches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <>
      <CalendarFilters />

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex-center py-12">
            <Loader2 className="animate-spin" style={{ color: "var(--color-primary-light)" }} />
          </div>
        ) : currentMatches.length > 0 ? (
          <>
            {currentMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </>
        ) : (
          <div
            className="rounded-xl p-12 text-center flex flex-col items-center justify-center"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            <span className="text-4xl mb-4">📅</span>
            <h3 className="text-xl font-bold mb-2">Aucun match trouvé</h3>
            <p className="max-w-md" style={{ color: "var(--color-text-muted)" }}>
              Il n&apos;y a aucun match correspondant à tes critères de recherche.
              Essaye de modifier les filtres ou d&apos;activer &laquo;&nbsp;Voir les matchs passés&nbsp;&raquo;.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
