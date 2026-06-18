"use client"

import type { Project } from "@/lib/store"
import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"

export function DocumentSidebar({
  project,
  selectedDocId,
  onSelect,
}: {
  project: Project
  selectedDocId: string
  onSelect: (id: string) => void
}) {
  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="rounded-xl border border-border bg-sidebar p-2">
        <div className="px-2 py-2">
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Documents
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground/70">
            {project.documents.length} attached
          </p>
        </div>
        <nav className="flex flex-col gap-0.5">
          {project.documents.map((doc) => {
            const active = doc.id === selectedDocId
            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => onSelect(doc.id)}
                className={cn(
                  "flex items-start gap-2.5 rounded-md px-2 py-2 text-left text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
                )}
              >
                <FileText
                  className={cn(
                    "mt-0.5 size-4 shrink-0",
                    active ? "text-foreground" : "text-muted-foreground/60",
                  )}
                />
                <span className="min-w-0">
                  <span className="block truncate font-medium leading-snug">
                    {doc.title}
                  </span>
                  <span className="block text-xs text-muted-foreground/70">
                    {doc.meta}
                  </span>
                </span>
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
