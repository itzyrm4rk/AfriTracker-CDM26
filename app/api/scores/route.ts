import { NextResponse } from "next/server"
import { fetchLiveMatches } from "@/lib/worldcup-api"

export const revalidate = 60

export async function GET() {
  try {
    // Pour les scores live, on retourne tous les matchs (live + récents terminés)
    const matches = await fetchLiveMatches()
    return NextResponse.json(matches)
  } catch (error) {
    console.error("API /scores error:", error)
    return NextResponse.json([], { status: 500 })
  }
}
