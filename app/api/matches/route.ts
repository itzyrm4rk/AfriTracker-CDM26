import { NextResponse } from "next/server"
import { fetchAllMatches } from "@/lib/worldcup-api"

export const revalidate = 60

export async function GET() {
  try {
    const matches = await fetchAllMatches()
    matches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    return NextResponse.json(matches)
  } catch (error) {
    console.error("API /matches error:", error)
    return NextResponse.json([], { status: 500 })
  }
}
