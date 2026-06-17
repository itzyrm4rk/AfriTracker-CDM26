import { NextResponse } from "next/server"
import { generateMomentum } from "@/lib/gemini"
import { getTodayDateInAfrica, isMatchOnAfricanDate } from "@/lib/timezone"

// Mise en cache globale native sur Vercel (6 heures)
export const revalidate = 21600 

export async function GET() {
  try {
    const { fetchAllMatches } = await import("@/lib/worldcup-api")
    const allMatches = await fetchAllMatches()
    
    // Jour calendaire strict basé sur le fuseau Africa/Douala (UTC+1)
    const todayAfrica = getTodayDateInAfrica()

    const africanMatches = allMatches.filter(m => 
      (m.homeTeam.isAfrican || m.awayTeam.isAfrican) &&
      m.status !== "finished" &&
      isMatchOnAfricanDate(m.date, todayAfrica)
    )

    if (africanMatches.length > 0) {
      const momentumText = await generateMomentum(africanMatches)
      if (momentumText) {
        return NextResponse.json({
          momentum: {
            text: momentumText,
            date: todayAfrica,
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

