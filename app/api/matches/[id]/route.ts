import { NextResponse } from "next/server"
import { fetchMatchDetails } from "@/lib/worldcup-api"

export const revalidate = 60

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const match = await fetchMatchDetails(id)
    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    return NextResponse.json(match)
  } catch (error) {
    console.error(`API /matches/[id] error:`, error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
