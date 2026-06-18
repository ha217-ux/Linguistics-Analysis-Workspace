"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useWorkspace } from "@/lib/store"
import { TopNav } from "@/components/top-nav"
import { FileText, MessageSquareText, ArrowUpRight } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user, projects, observations } = useWorkspace()

  useEffect(() => {
    if (!user) router.replace("/")
  }, [user, router])

  if (!user) return null

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Analysis projects
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Select a project to review documents and log observations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const count = observations.filter(
              (o) => o.projectId === project.id,
            ).length
            return (
              <Link
                key={project.id}
                href={`/workspace/${project.id}`}
                className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-ring/60"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-medium leading-snug text-pretty">
                    {project.name}
                  </h2>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-foreground" />
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
                <span className="mt-3 inline-flex w-fit rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                  {project.language}
                </span>
                <div className="mt-5 flex items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <FileText className="size-3.5" />
                    {project.documents.length} documents
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MessageSquareText className="size-3.5" />
                    {count} observations
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
