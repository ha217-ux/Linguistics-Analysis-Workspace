"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { TopNav } from "@/components/top-nav"
import { FileText, MessageSquareText, ArrowUpRight } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/")
        return
      }
      fetchProjects()
    })
  }, [])

  async function fetchProjects() {
    const { data: projectRows } = await supabase.from("projects").select("*")
    const { data: documentRows } = await supabase.from("documents").select("*")
    const { data: observationRows } = await supabase.from("observations").select("*")

    if (!projectRows) return

    const mapped = projectRows.map((p: any) => ({
      ...p,
      documents: (documentRows ?? []).filter((d: any) => d.project_id === p.id),
      observationCount: (observationRows ?? []).filter((o: any) =>
        (documentRows ?? []).filter((d: any) => d.project_id === p.id).map((d: any) => d.id).includes(o.document_id)
      ).length
    }))

    setProjects(mapped)
    setLoading(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Analysis projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Select a project to review documents and log observations.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/workspace/${project.id}`}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-ring/60"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-medium leading-snug">{project.name}</h2>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/50 group-hover:text-foreground" />
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
              <div className="mt-5 flex items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="size-3.5" />
                  {project.documents.length} documents
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MessageSquareText className="size-3.5" />
                  {project.observationCount} observations
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}