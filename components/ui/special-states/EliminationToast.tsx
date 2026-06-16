"use client"

import { toast } from "sonner"
import type { Team } from "@/types"

/**
 * Affiche un toast quand une équipe est éliminée.
 * À appeler depuis un effet qui détecte le changement de statut isEliminated.
 */
export function showEliminationToast(team: Team) {
  toast(`${team.flag} Le ${team.name} est éliminé`, {
    duration: 4000,
  })
}
