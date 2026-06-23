"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Props {
  currentPage: number
  totalPages: number
  /** Si fourni, la pagination est contrôlée par cet callback (mode état local).
   *  Sinon, elle navigue via l'URL (mode URL). */
  onPageChange?: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  const goTo = (page: number) => {
    if (onPageChange) {
      onPageChange(page)
    } else {
      router.push(createPageURL(page))
    }
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">Page {currentPage}</span>
        <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          sur {totalPages}
        </span>
      </div>

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
