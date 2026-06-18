"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useWorkspace } from "@/lib/store"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { ChevronRight, LogOut } from "lucide-react"

export function TopNav({ crumb }: { crumb?: string }) {
  const router = useRouter()
  const { user, logout } = useWorkspace()

  function handleLogout() {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo />
          </Link>
          {crumb && (
            <>
              <ChevronRight className="size-4 text-muted-foreground/50" />
              <span className="font-medium text-foreground">{crumb}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {user}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  )
}
