"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Calendar, Trophy, Activity } from "lucide-react"

const links = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/teams", label: "Équipes", icon: Users },
  { href: "/calendar", label: "Calendrier", icon: Calendar },
  { href: "/bracket", label: "Parcours", icon: Trophy },
  { href: "/stats", label: "Stats", icon: Activity },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 h-16 flex items-center justify-around px-2 z-20 pb-safe"
      style={{
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      {links.map(link => {
        const Icon = link.icon
        const isActive =
          pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))

        return (
          <Link
            key={link.href}
            href={link.href}
            className="flex flex-col items-center justify-center w-full h-full space-y-1"
            style={{ color: isActive ? "var(--color-primary-light)" : "var(--color-text-muted)" }}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{link.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
