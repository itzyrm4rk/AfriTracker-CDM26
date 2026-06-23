import { type NextRequest, NextResponse } from "next/server"

/**
 * Route utilitaire dépréciée (anciennement pour worldcup26.ir JWT)
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({ 
    message: "Cette route n'est plus nécessaire. La nouvelle API wcup2026.org ne requiert pas de token JWT.",
    token: "deprecated-token-not-needed"
  })
}
