import { Suspense } from "react"
import { fetchAllMatches, fetchScorers } from "@/lib/worldcup-api"
import StatsDashboard from "@/components/ui/StatsDashboard"

export const revalidate = 60 // Revalidate every minute

export default async function StatsPage() {
  const [matches, scorers] = await Promise.all([
    fetchAllMatches(),
    fetchScorers()
  ])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24">
      <Suspense fallback={<div className="animate-pulse">Chargement des statistiques...</div>}>
        <StatsDashboard matches={matches} scorers={scorers} />
      </Suspense>
    </div>
  )
}
