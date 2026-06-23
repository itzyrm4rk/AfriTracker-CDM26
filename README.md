# 🌍 AfriTracker — CdM 2026

Application web pour suivre les équipes africaines à la Coupe du Monde FIFA 2026.

## Stack

- **Next.js 15** (App Router, ISR)
- **TypeScript**
- **Tailwind CSS v4**
- **SWR** (data fetching + polling toutes les 30s)
- **Sonner** (toasts)
- **canvas-confetti** (animation champion)
- **API** : [wcup2026.org](https://wcup2026.org/api/data.php) — pas de token requis
- **IA** : Google Gemini (génération du "Momentum du jour")

## Installation

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Configuration `.env.local`

```env
# API WorldCup 2026 (nouvelle API communautaire — pas de token requis)
WORLDCUP_API_BASE=https://wcup2026.org/api/data.php

# IA — Google Gemini (Momentum du jour)
GOOGLE_GENERATIVE_AI_API_KEY=votre_cle_gemini

# Auth (si tu utilises NextAuth)
NEXTAUTH_SECRET=un_secret_aleatoire_long
NEXTAUTH_URL=http://localhost:3000

# Cron (protection du endpoint momentum)
CRON_SECRET=un_autre_secret_aleatoire
```

> ✅ Aucun token JWT requis. La nouvelle API est publique et accessible directement.

## Build production

```bash
npm run build   # Vérifie les erreurs TypeScript + construit le bundle
npm start       # Lance le serveur de production
```

## Déploiement Vercel

> **Si tu as déjà une version en production**, il suffit de :

### Étape 1 — Mettre à jour les variables d'environnement sur Vercel

C'est **obligatoire** avant le git push. Sans ça, la version en ligne continuera à pointer vers l'ancienne API hors service.

1. Va sur [vercel.com](https://vercel.com) → ton projet AfriTracker
2. **Settings → Environment Variables**
3. Supprime ou modifie les anciennes variables :
   - `WORLDCUP_API_TOKEN` → **Supprimer** (plus utilisé)
   - `WORLDCUP_API_BASE` → changer pour **`https://wcup2026.org/api/data.php`**
4. Clique **Save**

### Étape 2 — Pousser le code

```bash
git add .
git commit -m "Migration API: worldcup26.ir → wcup2026.org"
git push origin main
```

Vercel détecte automatiquement le push et re-déploie en ~2 minutes. ✅

### Variables d'environnement à configurer sur Vercel

| Variable | Valeur | Requis |
|---|---|---|
| `WORLDCUP_API_BASE` | `https://wcup2026.org/api/data.php` | ✅ Oui |
| `GOOGLE_GENERATIVE_AI_API_KEY` | ta clé Gemini | ✅ Oui |
| `NEXTAUTH_SECRET` | secret aléatoire long | ✅ Oui |
| `NEXTAUTH_URL` | `https://ton-app.vercel.app` | ✅ Oui |
| `CRON_SECRET` | secret aléatoire | ✅ Oui |

---

## Comment les données sont actualisées

L'app utilise le système **ISR (Incremental Static Regeneration)** de Next.js :

- Les données se rafraîchissent **toutes les 30 secondes** automatiquement côté serveur
- Le navigateur fait aussi un **polling toutes les 30s** pour les scores live
- Résultat : les visiteurs voient des données avec **max 30s de retard** sur la réalité
- **Aucun redéploiement nécessaire** pour chaque nouveau match ou score

## Système de fallback

L'app a 3 niveaux de protection en cas de panne de l'API externe :

```
1. API wcup2026.org répond → Données fraîches en temps réel
2. API lente (timeout > 10s) → Affichage des matchs depuis data/fallback-games.json
3. Tout est hors service → Interfaces vides propres, sans crash
```

## Structure du projet

```
app/
  api/                  # Routes API (matches, scores, standings, momentum, cron)
  onboarding/           # Écran d'accueil (1ère visite)
  teams/                # Liste + fiche détaillée par équipe
  calendar/             # Calendrier global filtrable
  bracket/              # Arbre de qualification
  stats/                # Statistiques globales + Soulier d'Or
  settings/             # Paramètres utilisateur
  page.tsx              # Dashboard principal
components/
  layout/               # Sidebar, Header, BottomNav, OnboardingGuard
  ui/                   # MatchCard, GroupTable, Bracket, MomentumCard, StatsDashboard...
data/
  teams.ts              # Les 48 équipes (noms FR + EN + codes FIFA + drapeaux)
  fallback-games.json   # Matchs de secours si l'API est indisponible
lib/
  worldcup-api.ts       # Client de l'API wcup2026.org (fetch + mapping + fallback)
  gemini.ts             # Génération du Momentum IA (Google Gemini)
  calendar.ts           # Google Calendar + .ics
  storage.ts            # localStorage (onboarding, équipes suivies)
  bracket-data.ts       # Structure de l'arbre (1/16 → Finale)
types/
  index.ts              # Types partagés (Team, Match, Group, MatchStat, etc.)
```

## Notes sur l'API wcup2026.org

L'API communautaire expose les endpoints suivants (pas de token requis) :

| Endpoint | Description |
|---|---|
| `?action=all` | Tous les matchs (groupes + knockout) |
| `?action=live` | Matchs en cours avec minute en temps réel |
| `?action=standings` | Classements par groupe |
| `?action=match&id=X` | Détails d'un match (buts, cartons, stats) |
| `?action=scorers` | Classement des buteurs |

Les données sont normalisées vers les types internes de l'app dans `lib/worldcup-api.ts`.
Les noms d'équipes en anglais sont traduits en français via `data/teams.ts` (`nameEn` mapping).
