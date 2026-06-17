import type { Match } from "@/types"

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent"

export async function generateMomentum(matchesOfTheDay: Match[]): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not defined")
    throw new Error("GEMINI_API_KEY is not defined")
  }

  const africanMatches = matchesOfTheDay.filter(
    m => m.homeTeam.isAfrican || m.awayTeam.isAfrican
  )

  if (africanMatches.length === 0) return null

  const matchesDesc = africanMatches
    .map(m => `${m.homeTeam.name} vs ${m.awayTeam.name} à ${m.stadium.city}`)
    .join(", ")
  const prompt = `Tu es un expert du football africain et de la Coupe du Monde.
Aujourd'hui, les matchs suivants impliquant des équipes africaines vont se jouer : ${matchesDesc}.

Génère un court "Momentum du jour" (3 ou 4 phrases maximum) pour chauffer les supporters africains.
Ce momentum doit :
1. Rappeler une anecdote historique glorieuse, une statistique impressionnante, ou un contexte épique concernant l'une de ces équipes africaines ou le football africain en général à la Coupe du Monde.
2. RÈGLE ABSOLUE ANTI-HALLUCINATION : N'invente AUCUNE statistique ni aucun fait. Tu dois te baser EXCLUSIVEMENT sur l'histoire réelle et vérifiable de la FIFA. Si tu n'es pas sûr à 100% d'un fait historique, ne l'utilise pas et concentre-toi uniquement sur l'enjeu du match d'aujourd'hui.
3. Faire le lien avec le(s) match(s) du jour pour créer de l'excitation.
4. Être très enthousiaste, utiliser des emojis, et être formaté sans markdown complexe (juste du texte simple).

Ne mets pas d'introduction du style "Voici le momentum :" ou "Salut !". Commence directement par l'anecdote.`

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 200 },
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error("Gemini API error status:", res.status, errorText)
      throw new Error(`Gemini API Error: ${res.status} - ${errorText}`)
    }

    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      console.error("Gemini response missing text:", JSON.stringify(data))
      throw new Error("Gemini response missing text")
    }

    return text.trim()
  } catch (error: any) {
    console.error("Error calling Gemini API:", error)
    throw error
  }
}
