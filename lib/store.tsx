"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { supabase } from "@/lib/supabase"

export const CATEGORIES = [
  "Syntax",
  "Lexicon",
  "Register",
  "Style",
  "Cohesion",
] as const

export type Category = (typeof CATEGORIES)[number]

export type Document = {
  id: string
  title: string
  description: string
}

export type Project = {
  id: string
  name: string
  description: string
  language: string
  documents: Document[]
}

export type Observation = {
  id: string
  projectId: string
  documentId: string
  category: Category
  notes: string
  createdAt: number
}

type WorkspaceContextValue = {
  user: string | null
  logout: () => void
  projects: Project[]
  observations: Observation[]
  addObservation: (input: Omit<Observation, "id" | "createdAt">) => Promise<void>
  getProject: (id: string) => Project | undefined
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [observations, setObservations] = useState<Observation[]>([])

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user.email ?? null)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user.email ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  // Fetch projects + documents
  useEffect(() => {
    if (!user) return
    async function fetchProjects() {
  console.log("fetching projects for user:", user)
      const { data: projectRows } = await supabase.from("projects").select("*")
      const { data: documentRows } = await supabase.from("documents").select("*")
      if (!projectRows) return
      const mapped: Project[] = projectRows.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description ?? "",
        language: "",
        documents: (documentRows ?? [])
          .filter((d) => d.project_id === p.id)
          .map((d) => ({ id: d.id, title: d.title, description: d.description ?? "" })),
      }))
      setProjects(mapped)
    }
    fetchProjects()
  }, [user])

  // Fetch observations
  useEffect(() => {
    if (!user) return
    async function fetchObservations() {
      const { data } = await supabase.from("observations").select("*")
      if (!data) return
      const mapped: Observation[] = data.map((o) => ({
        id: o.id,
        projectId: "",
        documentId: o.document_id,
        category: o.category as Category,
        notes: o.note,
        createdAt: new Date(o.created_at).getTime(),
      }))
      setObservations(mapped)
    }
    fetchObservations()
  }, [user])

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      user,
      logout: async () => {
        await supabase.auth.signOut()
        setUser(null)
      },
      projects,
      observations,
      addObservation: async (input) => {
        const { data } = await supabase
          .from("observations")
          .insert({
            document_id: input.documentId,
            category: input.category,
            note: input.notes,
          })
          .select()
          .single()
        if (data) {
          setObservations((prev) => [
            {
              id: data.id,
              projectId: input.projectId,
              documentId: data.document_id,
              category: data.category as Category,
              notes: data.note,
              createdAt: new Date(data.created_at).getTime(),
            },
            ...prev,
          ])
        }
      },
      getProject: (id) => projects.find((p) => p.id === id),
    }),
    [user, projects, observations],
  )

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider")
  }
  return ctx
}
