import { type NextRequest, NextResponse } from "next/server"
import { fetchMatchesByDate } from "@/lib/worldcup-api"
import { generateMomentum } from "@/lib/gemini"

function isAuthorized(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  return authHeader === `Bearer ${process.env.CRON_SECRET}`
}

async function handleMomentumGeneration() {
  const today = new Date().toISOString().split("T")[0]

  try {
    const matchesOfTheDay = await fetchMatchesByDate(today)
    const africanMatches = matchesOfTheDay.filter(
      m => m.homeTeam.isAfrican || m.awayTeam.isAfrican
    )

    if (africanMatches.length > 0) {
      const momentumText = await generateMomentum(africanMatches)

      if (momentumText) {
        const momentumData = {
          text: momentumText,
          date: today,
          matchesOfTheDay: africanMatches.map(
            m => `${m.homeTeam.name} vs ${m.awayTeam.name}`
          ),
        }

        if (process.env.KV_REST_API_URL?.startsWith("https://") && process.env.KV_REST_API_TOKEN) {
          const { kv } = await import("@vercel/kv")
          await kv.set(`momentum:${today}`, momentumData, { ex: 86400 })
        }

        return NextResponse.json({ success: true, momentum: momentumData })
      }
    }

    return NextResponse.json({ success: true, message: "Aucun momentum généré pour aujourd'hui." })
  } catch (error) {
    console.error("Cron Momentum Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
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
