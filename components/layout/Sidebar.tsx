"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Calendar, Trophy, Settings, Activity } from "lucide-react"

const links = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/teams", label: "Équipes", icon: Users },
  { href: "/calendar", label: "Calendrier", icon: Calendar },
  { href: "/bracket", label: "Parcours", icon: Trophy },
  { href: "/stats", label: "Stats", icon: Activity },
  { href: "/settings", label: "Paramètres", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="hidden md:flex flex-col w-64 h-screen sticky top-0 shrink-0"
      style={{
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
      }}
    >
      <div
        className="h-16 flex items-center px-6"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <Link href="/" className="flex items-center gap-2">
          <span
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-primary-light)" }}
          >
            🌍 AfriTracker
          </span>
        </Link>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-1">
        {links.map(link => {
          const Icon = link.icon
          const isActive =
            pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))

          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
              style={{
                background: isActive ? "rgba(76,175,80,0.15)" : "transparent",
                color: isActive ? "var(--color-primary-light)" : "var(--color-text-muted)",
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="font-medium">{link.label}</span>
            </Link>
          )
        })}
      </nav>

      <div
        className="p-4 text-xs"
        style={{ borderTop: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
      >
        CdM 2026 · 11 juin – 19 juillet
      </div>
    </aside>
  )
}
