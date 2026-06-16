import { NextResponse } from "next/server"
import { fetchStandings } from "@/lib/worldcup-api"

export const revalidate = 120

export async function GET() {
  try {
    const groups = await fetchStandings()
    return NextResponse.json(groups)
  } catch (error) {
    console.error("API /standings error:", error)
    return NextResponse.json([], { status: 500 })
  }
}
