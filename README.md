# 🌍 AfriTracker — CdM 2026

Application web (PWA) pour suivre les équipes africaines à la Coupe du Monde FIFA 2026.

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** (animations)
- **SWR** (data fetching + polling)
- **Sonner** (toasts)
- **canvas-confetti** (animation champion)
- API : [worldcup2026 (worldcup26.ir)](https://github.com/rezarahiminia/worldcup2026)
- IA : Google Gemini (génération du "Momentum du jour")
- Stockage : Vercel KV (optionnel, pour le momentum)

## Installation

```bash
npm install
```

## Configuration

Copier `.env.local` et compléter les variables :

```bash
# 1. Obtenir un token JWT de l'API worldcup26.ir
curl -X POST https://worldcup26.ir/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"AfriTracker","email":"vous@example.com","password":"motdepasse"}'

# Copier le "token" reçu dans WORLDCUP_API_TOKEN
```

```env
WORLDCUP_API_TOKEN=eyJhbGc...
WORLDCUP_API_BASE=https://worldcup26.ir
GEMINI_API_KEY=votre_cle_gemini
KV_REST_API_URL=...       # optionnel, auto-injecté sur Vercel
KV_REST_API_TOKEN=...     # optionnel, auto-injecté sur Vercel
CRON_SECRET=un_secret_aleatoire
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> 💡 Une route utilitaire `/api/auth` (POST, protégée par `CRON_SECRET`) permet
> aussi d'obtenir le token directement depuis l'app si besoin.

## Lancer en développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Build production

```bash
npm run build
npm start
```

## Déploiement Vercel

1. Connecter le repo à Vercel
2. Ajouter les variables d'environnement (voir ci-dessus)
3. Activer Vercel KV (Storage → KV) pour le cache du Momentum IA
4. Le cron `/api/cron/momentum` se déclenchera automatiquement chaque jour à 07h00 UTC (voir `vercel.json`)

## Structure du projet

```
app/
  api/                  # Routes API (matches, scores, standings, momentum, cron)
  onboarding/           # Écran d'accueil (1ère visite)
  teams/                # Liste + fiche détaillée par équipe
  calendar/             # Calendrier global filtrable
  bracket/              # Arbre de qualification
  settings/             # Paramètres (nations supplémentaires)
  page.tsx              # Dashboard
  layout.tsx
components/
  layout/               # Sidebar, Header, BottomNav, OnboardingGuard
  ui/                   # MatchCard, GroupTable, Bracket, MomentumCard, etc.
  ui/special-states/    # Élimination, Finale, Champion
data/
  teams.ts              # Les 48 équipes qualifiées (CdM 2026)
hooks/                  # useTeams, useLiveScores, useStandings, useMomentum...
lib/
  worldcup-api.ts        # Client de l'API worldcup26.ir
  gemini.ts              # Génération du Momentum IA
  calendar.ts            # Google Calendar + .ics
  storage.ts             # localStorage (onboarding, équipes suivies)
  bracket-data.ts         # Structure de l'arbre (1/16 → Finale)
types/
  index.ts               # Types partagés (Team, Match, Group, etc.)
```

## Notes sur l'API worldcup2026

L'API publique (`https://worldcup26.ir`) expose :
- `GET /get/teams` — les 48 équipes
- `GET /get/games` — tous les matchs
- `GET /get/groups` — classements par groupe
- `GET /get/stadiums` — les stades

La plupart des routes nécessitent un token JWT (`Authorization: Bearer <token>`),
obtenu via `/auth/register` ou `/auth/login`. Le client dans `lib/worldcup-api.ts`
normalise les données reçues vers les types internes de l'app, avec un fallback
sur les données statiques (`data/teams.ts`) si l'API est indisponible.
