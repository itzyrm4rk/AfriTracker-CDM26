import { type NextRequest, NextResponse } from "next/server"
import { registerAndGetToken } from "@/lib/worldcup-api"

/**
 * Route utilitaire pour obtenir un token JWT WorldCup26.ir
 * Appeler en POST avec { email, password, name }
 * Sécurisée par CRON_SECRET pour usage admin uniquement
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { email, password, name } = body

  if (!email || !password) {
    return NextResponse.json({ error: "email and password are required" }, { status: 400 })
  }

  const token = await registerAndGetToken(email, password, name || "AfriTracker")

  if (!token) {
    return NextResponse.json({ error: "Failed to get token" }, { status: 500 })
  }

  return NextResponse.json({ token, message: "Add this token to WORLDCUP_API_TOKEN in .env.local" })
}
