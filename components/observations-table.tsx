"use client"

import { useWorkspace, type Category, type Project } from "@/lib/store"
import { cn } from "@/lib/utils"

const CATEGORY_STYLES: Record<Category, string> = {
  Syntax: "border-chart-1/40 text-chart-1",
  Lexicon: "border-chart-2/40 text-chart-2",
  Register: "border-chart-3/40 text-chart-3",
  Style: "border-chart-4/40 text-chart-4",
  Cohesion: "border-chart-5/40 text-chart-5",
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function ObservationsTable({ project }: { project: Project }) {
  const { observations } = useWorkspace()
  const rows = observations.filter((o) => o.projectId === project.id)
  const docTitle = (id: string) =>
    project.documents.find((d) => d.id === id)?.title ?? "—"

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <h2 className="text-sm font-semibold">Observations</h2>
        <span className="text-xs text-muted-foreground">
          {rows.length} {rows.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-muted-foreground">
          No observations yet. Log your first finding above.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-2.5 font-medium">Category</th>
                <th className="px-5 py-2.5 font-medium">Document</th>
                <th className="px-5 py-2.5 font-medium">Notes</th>
                <th className="px-5 py-2.5 text-right font-medium">Logged</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-border/60 last:border-0 align-top"
                >
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "inline-flex rounded-full border bg-background px-2 py-0.5 text-xs font-medium",
                        CATEGORY_STYLES[o.category],
                      )}
                    >
                      {o.category}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-muted-foreground">
                    {docTitle(o.documentId)}
                  </td>
                  <td className="px-5 py-3.5 leading-relaxed text-pretty">
                    {o.notes}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right text-xs text-muted-foreground">
                    {formatDate(o.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
