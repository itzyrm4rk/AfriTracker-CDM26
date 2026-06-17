import { type NextRequest, NextResponse } from "next/server"
import { generateMomentum } from "@/lib/gemini"
import { getTodayDateInAfrica, isMatchOnAfricanDate } from "@/lib/timezone"

function isAuthorized(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  return authHeader === `Bearer ${process.env.CRON_SECRET}`
}

async function handleMomentumGeneration() {
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
        const momentumData = {
          text: momentumText,
          date: todayAfrica,
          matchesOfTheDay: africanMatches.map(
            m => `${m.homeTeam.name} vs ${m.awayTeam.name}`
          ),
        }

        return NextResponse.json({ success: true, momentum: momentumData })
      } else {
        return NextResponse.json({ success: false, error: "Gemini API failed to generate text." }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, message: "Aucun match africain prévu aujourd'hui." })
  } catch (error: any) {
    console.error("Cron Momentum Error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return handleMomentumGeneration()
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return handleMomentumGeneration()
}
