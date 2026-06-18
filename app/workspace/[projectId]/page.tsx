"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { useWorkspace } from "@/lib/store"
import { TopNav } from "@/components/top-nav"
import { DocumentSidebar } from "@/components/document-sidebar"
import { ObservationForm } from "@/components/observation-form"
import { ObservationsTable } from "@/components/observations-table"

export default function WorkspacePage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = use(params)
  const router = useRouter()
  const { user, getProject } = useWorkspace()
  const project = getProject(projectId)
  const [selectedDocId, setSelectedDocId] = useState<string>("")

  useEffect(() => {
    if (!user) router.replace("/")
  }, [user, router])

  useEffect(() => {
    if (project && !selectedDocId) {
      setSelectedDocId(project.documents[0]?.id ?? "")
    }
  }, [project, selectedDocId])

  if (!user) return null

  if (!project) {
    return (
      <div className="min-h-screen">
        <TopNav />
        <main className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="text-sm text-muted-foreground">
            Project not found.
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <TopNav crumb={project.name} />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 lg:flex-row">
        <DocumentSidebar
          project={project}
          selectedDocId={selectedDocId}
          onSelect={setSelectedDocId}
        />

        <main className="flex min-w-0 flex-1 flex-col gap-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-balance">
              {project.name}
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </div>

          <ObservationForm
            project={project}
            selectedDocId={selectedDocId}
            onDocChange={setSelectedDocId}
          />

          <ObservationsTable project={project} />
        </main>
      </div>
    </div>
  )
}
