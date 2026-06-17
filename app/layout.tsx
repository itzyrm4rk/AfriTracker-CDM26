import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"
import OnboardingGuard from "@/components/layout/OnboardingGuard"
import { Toaster } from "sonner"

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
})

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
})

export const viewport: Viewport = {
  themeColor: "#1B5E20",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://afri-tracker.vercel.app"

export const metadata: Metadata = {
  title: {
    default: "AfriTracker — CdM 2026",
    template: "%s · AfriTracker",
  },
  description:
    "Suivez les équipes africaines à la Coupe du Monde FIFA 2026 en temps réel. Scores live, classements, calendrier et bracket.",
  keywords: ["Coupe du Monde 2026", "équipes africaines", "football", "Maroc", "Sénégal"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AfriTracker",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    title: "AfriTracker — Suis l'Afrique jusqu'au bout · CdM 2026",
    description: "Scores live, matchs, classements et bracket des équipes africaines à la Coupe du Monde FIFA 2026.",
    siteName: "AfriTracker",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
        <Toaster position="top-center" theme="dark" richColors />
        <OnboardingGuard>{children}</OnboardingGuard>
      </body>
    </html>
  )
}
