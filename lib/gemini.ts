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

  const phaseMap: Record<string, string> = {
    "group": "Phase de groupes",
    "round_32": "Seizièmes de finale (Élimination directe)",
    "round_16": "Huitièmes de finale (Élimination directe)",
    "quarter_final": "Quarts de finale (Élimination directe)",
    "semi_final": "Demi-finale (Élimination directe)",
    "third_place": "Match pour la 3ème place",
    "final": "Grande Finale de la Coupe du Monde"
  }

  const matchesDesc = africanMatches
    .map(m => {
      const phaseLabel = m.phase ? (phaseMap[m.phase.toLowerCase()] || m.phase) : "Tournoi"
      return `${m.homeTeam.name} vs ${m.awayTeam.name} [${phaseLabel}]`
    })
    .join(", ")

  const prompt = `Tu es un expert du football africain et de la Coupe du Monde.
Aujourd'hui, les matchs suivants impliquant des équipes africaines vont se jouer : ${matchesDesc}.

Génère un court "Momentum du jour" (3 ou 4 phrases maximum) pour chauffer les supporters africains.
Ce momentum doit :
1. Préciser l'ENJEU CONCRET du match en fonction de sa phase (ex: "C'est un match à élimination directe, une victoire les propulse au tour suivant !").
2. Rappeler une véritable anecdote historique ou une statistique impressionnante VRAIE concernant l'une de ces équipes (ou le football africain) à la Coupe du Monde.
3. RÈGLE ABSOLUE ANTI-HALLUCINATION : N'invente AUCUNE date, AUCUNE statistique ni aucun faux fait historique. Si tu n'es pas sûr d'une date exacte, ne la donne pas.
4. Être très enthousiaste, utiliser des emojis, et être formaté sans markdown complexe (juste du texte simple).

Ne mets pas d'introduction. Commence directement ton texte.`

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