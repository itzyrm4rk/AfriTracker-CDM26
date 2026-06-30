"use client"

import { useState, useMemo } from "react"
import { Trophy, Activity, Flag } from "lucide-react"
import { getTeamByName, TeamData } from "@/data/teams"
import type { Match } from "@/types"
import type { Scorer } from "@/lib/worldcup-api"
import Pagination from "@/components/ui/Pagination"

interface Props {
  matches: Match[]
  scorers: Scorer[]
}

export default function StatsDashboard({ matches, scorers }: Props) {
  const [filterAfrica, setFilterAfrica] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const SCORERS_PER_PAGE = 10

  // -- Enrich scorers with team data --
  const enrichedScorers = useMemo(() => {
    return scorers.map(s => {
      const localTeam = getTeamByName(s.team)
      return { ...s, teamData: localTeam }
    }).sort((a, b) => b.goals - a.goals)
  }, [scorers])

  // -- Calculate globals --
  const stats = useMemo(() => {
    let totalGoals = 0
    let totalMatchesPlayed = 0
    let yellowCards = 0
    let redCards = 0

    matches.forEach(m => {
      if (m.status === "finished" || m.status === "live") {
        totalMatchesPlayed++
        
        const homeIsAf = m.homeTeam.isAfrican
        const awayIsAf = m.awayTeam.isAfrican
        
        if (!filterAfrica) {
          totalGoals += (m.homeScore || 0) + (m.awayScore || 0)
        } else {
          if (homeIsAf) totalGoals += (m.homeScore || 0)
          if (awayIsAf) totalGoals += (m.awayScore || 0)
        }

        // Calcul des cartons
        let matchHasCardEvents = false
        if (m.events && Array.isArray(m.events)) {
          m.events.forEach(event => {
            if (event.type === "yellow_card" || event.type === "red_card") {
              matchHasCardEvents = true
              let countCard = false
              
              if (!filterAfrica) {
                countCard = true
              } else {
                if (event.team === m.homeTeam.name && homeIsAf) countCard = true
                if (event.team === m.awayTeam.name && awayIsAf) countCard = true
              }

              if (countCard) {
                if (event.type === "yellow_card") yellowCards++
                if (event.type === "red_card") redCards++
              }
            }
          })
        }

        // Fallback: Si l'API ne renvoie pas le détail des événements mais renvoie les statistiques globales
        if (!matchHasCardEvents && m.stats && Array.isArray(m.stats)) {
          m.stats.forEach(stat => {
            if (stat.keyEn === "Yellow cards" || stat.key === "Cartons jaunes" || stat.keyEn === "Yellow Cards") {
              if (!filterAfrica) {
                yellowCards += (stat.homeValue || 0) + (stat.awayValue || 0)
              } else {
                if (homeIsAf) yellowCards += (stat.homeValue || 0)
                if (awayIsAf) yellowCards += (stat.awayValue || 0)
              }
            }
            if (stat.keyEn === "Red cards" || stat.key === "Cartons rouges" || stat.keyEn === "Red Cards") {
              if (!filterAfrica) {
                redCards += (stat.homeValue || 0) + (stat.awayValue || 0)
              } else {
                if (homeIsAf) redCards += (stat.homeValue || 0)
                if (awayIsAf) redCards += (stat.awayValue || 0)
              }
            }
          })
        }
      }
    })

    // Si aucune carte n'est trouvée (ex: si l'API ne renvoie pas les événements), afficher "-"
    return { 
      totalGoals, 
      totalMatchesPlayed, 
      yellowCards: yellowCards > 0 ? yellowCards : "-", 
      redCards: redCards > 0 ? redCards : "-" 
    }
  }, [matches, filterAfrica])

  // -- Filter and Paginate scorers --
  const displayScorers = useMemo(() => {
    let filtered = enrichedScorers
    if (filterAfrica) {
      filtered = enrichedScorers.filter(s => s.teamData?.isAfrican)
    }
    
    const startIndex = (currentPage - 1) * SCORERS_PER_PAGE
    const paginated = filtered.slice(startIndex, startIndex + SCORERS_PER_PAGE)
    
    return {
      items: paginated,
      totalPages: Math.ceil(filtered.length / SCORERS_PER_PAGE) || 1,
      totalItems: filtered.length
    }
  }, [enrichedScorers, filterAfrica, currentPage])

  // Reset pagination when filter changes
  useMemo(() => setCurrentPage(1), [filterAfrica])

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
            <Activity style={{ color: "var(--color-primary)" }} /> Statistiques
          </h1>
          <p className="text-sm opacity-70 mt-1">Données officielles du tournoi</p>
        </div>
        
        {/* Toggle Afrique */}
        <button
          onClick={() => setFilterAfrica(!filterAfrica)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
            filterAfrica 
              ? "bg-[var(--color-primary)] text-white shadow-[0_0_15px_rgba(46,204,113,0.3)]" 
              : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-white/20"
          }`}
        >
          <Flag size={16} /> 
          {filterAfrica ? "Filtre: Afrique" : "Vue Globale"}
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Buts Marqués" value={stats.totalGoals} icon="⚽" color="var(--color-text)" />
        <StatCard title="Matchs Joués" value={`${stats.totalMatchesPlayed} / 104`} icon="🏟️" color="var(--color-text)" />
        <StatCard title="Cartons Jaunes" value={stats.yellowCards} icon="🟨" color="#eab308" />
        <StatCard title="Cartons Rouges" value={stats.redCards} icon="🟥" color="#ef4444" />
      </div>

      {/* Scorers Leaderboard */}
      <div className="rounded-xl overflow-hidden flex flex-col" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        <div className="p-4 flex items-center gap-2" style={{ borderBottom: "1px solid var(--color-border)" }}>
          <Trophy size={18} style={{ color: "var(--color-gold)" }} />
          <h2 className="font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>Soulier d'Or</h2>
          <span className="ml-auto text-xs text-slate-400 font-medium bg-slate-800 px-2 py-1 rounded-full">
            {displayScorers.totalItems} buteurs
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase" style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}>
              <tr>
                <th className="px-6 py-3 font-semibold">#</th>
                <th className="px-6 py-3 font-semibold">Joueur</th>
                <th className="px-6 py-3 font-semibold text-center">Buts</th>
              </tr>
            </thead>
            <tbody>
              {displayScorers.items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    Aucun buteur trouvé {filterAfrica ? "pour l'Afrique" : ""}.
                  </td>
                </tr>
              ) : (
                displayScorers.items.map((s, idx) => {
                  const actualRank = (currentPage - 1) * SCORERS_PER_PAGE + idx + 1
                  return (
                    <tr 
                      key={idx} 
                      className="border-b transition-colors hover:bg-white/5" 
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <td className="px-6 py-4 font-bold" style={{ color: actualRank <= 3 ? "var(--color-gold)" : "var(--color-text-muted)" }}>
                        {actualRank}
                      </td>
                      <td className="px-6 py-4 font-medium flex items-center gap-3">
                        {s.teamData?.flagUrl ? (
                          <img src={s.teamData.flagUrl} alt={s.team} className="w-6 h-4 object-cover rounded-sm shadow-sm" />
                        ) : (
                          <span>{s.teamData?.flag || "🏳️"}</span>
                        )}
                        {s.name}
                      </td>
                      <td className="px-6 py-4 font-bold text-center text-lg">{s.goals}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={displayScorers.totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }: { title: string, value: string | number, icon: string, color: string }) {
  return (
    <div 
      className="p-4 rounded-xl flex flex-col justify-between"
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
    >
      <div className="flex items-center justify-between mb-2 opacity-70">
        <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-2xl sm:text-3xl font-bold truncate" style={{ fontFamily: "var(--font-display)", color }}>
        {value}
      </div>
    </div>
  )
}
