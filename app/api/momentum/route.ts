import { NextResponse } from "next/server"
import { generateMomentum } from "@/lib/gemini"

// Mise en cache globale native sur Vercel (6 heures)
export const revalidate = 21600 

export async function GET() {
  try {
    const { fetchAllMatches } = await import("@/lib/worldcup-api")
    const allMatches = await fetchAllMatches()
    
    // Fenêtre : de -12h (pour inclure les matchs live) à +24h maximum
    const now = new Date()
    const startTime = new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString()
    const endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()

    const africanMatches = allMatches.filter(m => 
      (m.homeTeam.isAfrican || m.awayTeam.isAfrican) &&
      m.status !== "finished" &&
      m.date >= startTime &&
      m.date <= endTime
    )

    if (africanMatches.length > 0) {
      const momentumText = await generateMomentum(africanMatches)
      if (momentumText) {
        return NextResponse.json({
          momentum: {
            text: momentumText,
            date: new Date().toISOString().split("T")[0],
            matchesOfTheDay: africanMatches.map(m => `${m.homeTeam.name} vs ${m.awayTeam.name}`)
          }
        })
      }
    }

    return NextResponse.json({ momentum: null })
  } catch (error) {
    console.error("API Momentum Generation Error:", error)
    return NextResponse.json({ momentum: null })
  }
}
