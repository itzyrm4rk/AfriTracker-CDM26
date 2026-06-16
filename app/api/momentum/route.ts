import { NextResponse } from "next/server"

export const revalidate = 0

export async function GET() {
  try {
    // Essai avec Vercel KV si disponible
    const today = new Date().toISOString().split("T")[0]

    if (process.env.KV_REST_API_URL?.startsWith("https://") && process.env.KV_REST_API_TOKEN) {
      const { kv } = await import("@vercel/kv")
      const momentum = await kv.get(`momentum:${today}`)
      return NextResponse.json({ momentum })
    }

    // Fallback: pas de KV configuré
    return NextResponse.json({ momentum: null })
  } catch (error) {
    console.error("API Momentum Read Error:", error)
    return NextResponse.json({ momentum: null })
  }
}
