import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ALL_TEAMS } from "@/data/teams"
import GroupTable from "@/components/ui/GroupTable"
import EliminatedBanner from "@/components/ui/EliminatedBanner"
import MatchCard from "@/components/ui/MatchCard"
import Pagination from "@/components/ui/Pagination"
import type { Match, Group } from "@/types"

async function getTeamMatches(teamName: string): Promise<Match[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  try {
    const res = await fetch(`${baseUrl}/api/matches`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    const allMatches: Match[] = await res.json()
    return allMatches.filter(
      m => m.homeTeam.name === teamName || m.awayTeam.name === teamName
    )
  } catch {
    return []
  }
}

async function getGroupStanding(groupLetter: string): Promise<Group | null> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  try {
    const res = await fetch(`${baseUrl}/api/standings`, { next: { revalidate: 120 } })
    if (!res.ok) return null
    const standings: Group[] = await res.json()
    return standings.find(g => g.name === groupLetter) ?? null
  } catch {
    return null
  }
}

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const team = ALL_TEAMS.find(t => t.code === id)
  if (!team) return { title: "Équipe introuvable" }
  return {
    title: `${team.name} - AfriTracker`,
    description: `Parcours de ${team.name} à la Coupe du Monde 2026.`,
  }
}

export default async function TeamDetailPage({ params, searchParams }: Props) {
  const { id } = await params
  const { page } = await searchParams
  const team = ALL_TEAMS.find(t => t.code === id)

  if (!team) notFound()

  const allMatches = await getTeamMatches(team.name)
  const teamGroup = await getGroupStanding(team.group)

  const currentPage = Number(page) || 1
  const itemsPerPage = 6
  const totalPages = Math.ceil(allMatches.length / itemsPerPage)
  const currentMatches = allMatches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center mb-10 pt-4">
        {team.isEliminated && <EliminatedBanner phase={team.eliminatedAt || "Phase inconnue"} />}
        <span className="text-8xl sm:text-9xl drop-shadow-2xl mb-6">{team.flag}</span>
        <h1
          className="text-4xl sm:text-5xl font-black mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {team.name}
        </h1>
        <div className="flex gap-3 text-sm font-bold uppercase tracking-wider">
          <span
            className="px-3 py-1 rounded-full"
            style={{ background: "var(--color-surface-2)" }}
          >
            Groupe {team.group}
          </span>
          {team.isAfrican && (
            <span
              className="px-3 py-1 rounded-full"
              style={{ background: "rgba(76,175,80,0.2)", color: "var(--color-primary-light)" }}
            >
              Afrique 🌍
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-12">
        {/* Classement du groupe */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 rounded-full" style={{ background: "var(--color-primary-light)" }} />
            <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Classement du groupe
            </h2>
          </div>
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--color-border)" }}
          >
            {teamGroup ? (
              <GroupTable group={teamGroup} highlightTeam={team.code} detailed />
            ) : (
              <div
                className="p-4 text-center"
                style={{ color: "var(--color-text-muted)" }}
              >
                Classement indisponible.
              </div>
            )}
          </div>
        </section>

        {/* Matchs */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 rounded-full" style={{ background: "var(--color-primary-light)" }} />
            <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Matchs
            </h2>
          </div>

          {currentMatches.length > 0 ? (
            <div className="flex flex-col gap-4">
              {currentMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
          ) : (
            <div
              className="rounded-xl p-8 text-center"
              style={{ color: "var(--color-text-muted)", background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              Aucun match trouvé pour cette équipe.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
