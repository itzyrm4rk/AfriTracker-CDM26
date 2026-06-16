"use client"

import { useState, useMemo } from "react"
import { ALL_TEAMS } from "@/data/teams"
import TeamCard from "@/components/ui/TeamCard"
import { Search, X } from "lucide-react"

const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
}

export default function TeamsPage() {
  const [search, setSearch] = useState("")
  const [groupFilter, setGroupFilter] = useState<string>("all")

  const filteredTeams = useMemo(() => {
    let teams = [...ALL_TEAMS]

    // Filtre par groupe
    if (groupFilter !== "all") {
      teams = teams.filter(t => t.group === groupFilter)
    }

    // Filtre par recherche
    if (search.trim()) {
      const query = normalizeString(search.trim())
      teams = teams.filter(t =>
        normalizeString(t.name).includes(query) ||
        normalizeString(t.nameEn).includes(query) ||
        normalizeString(t.code).includes(query)
      )
    }

    // Tri : africaines actives → non-africaines actives → éliminées
    return [
      ...teams.filter(t => t.isAfrican && !t.isEliminated),
      ...teams.filter(t => !t.isAfrican && !t.isEliminated),
      ...teams.filter(t => t.isAfrican && t.isEliminated),
      ...teams.filter(t => !t.isAfrican && t.isEliminated),
    ]
  }, [search, groupFilter])

  const clearSearch = () => setSearch("")

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-black" style={{ fontFamily: "var(--font-display)" }}>
          Toutes les{" "}
          <span style={{ color: "var(--color-primary-light)" }}>Équipes</span>
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          Découvre les 48 nations participant à la Coupe du Monde 2026.
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--color-text-muted)" }}
        />
        <input
          id="team-search"
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher une équipe (nom, code FIFA)…"
          className="w-full pl-10 pr-10 py-3 rounded-xl text-sm font-medium outline-none transition-all placeholder:text-[var(--color-text-muted)]"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }}
          onFocus={e => (e.target.style.borderColor = "var(--color-primary)")}
          onBlur={e => (e.target.style.borderColor = "var(--color-border)")}
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full transition-colors"
            style={{ color: "var(--color-text-muted)" }}
            aria-label="Effacer la recherche"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filtres par groupe */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1 scrollbar-hide">
        <button
          onClick={() => setGroupFilter("all")}
          className="shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
          style={{
            background: groupFilter === "all" ? "var(--color-primary)" : "var(--color-surface)",
            color: groupFilter === "all" ? "white" : "var(--color-text-muted)",
            border: `1px solid ${groupFilter === "all" ? "var(--color-primary)" : "var(--color-border)"}`,
          }}
        >
          Tous
        </button>
        {GROUPS.map(g => (
          <button
            key={g}
            onClick={() => setGroupFilter(groupFilter === g ? "all" : g)}
            className="shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
            style={{
              background: groupFilter === g ? "var(--color-primary)" : "var(--color-surface)",
              color: groupFilter === g ? "white" : "var(--color-text-muted)",
              border: `1px solid ${groupFilter === g ? "var(--color-primary)" : "var(--color-border)"}`,
            }}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Compteur de résultats */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
          {filteredTeams.length} équipe{filteredTeams.length !== 1 ? "s" : ""}
          {groupFilter !== "all" && ` · Groupe ${groupFilter}`}
          {search.trim() && ` · "${search.trim()}"`}
        </span>
        {(search || groupFilter !== "all") && (
          <button
            onClick={() => { setSearch(""); setGroupFilter("all") }}
            className="text-xs font-medium px-3 py-1 rounded-full transition-colors"
            style={{ color: "var(--color-primary-light)", background: "rgba(76,175,80,0.1)" }}
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Grille d'équipes */}
      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredTeams.map((team, index) => (
            <TeamCard key={team.code} team={team} index={index} />
          ))}
        </div>
      ) : (
        <div
          className="rounded-xl p-8 text-center"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-bold mb-1" style={{ color: "var(--color-text)" }}>
            Aucune équipe trouvée
          </p>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Essaie un autre nom ou change le filtre de groupe.
          </p>
        </div>
      )}
    </div>
  )
}
