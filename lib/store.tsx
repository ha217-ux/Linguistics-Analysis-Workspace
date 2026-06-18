"use client"

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

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
  meta: string
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

const SEED_PROJECTS: Project[] = [
  {
    id: "p-1",
    name: "Victorian Periodical Prose",
    description: "Register shifts across serialized fiction, 1850–1880.",
    language: "English (EN-GB)",
    documents: [
      { id: "d-1", title: "Household Words — Vol. III", meta: "12,400 words" },
      { id: "d-2", title: "All the Year Round — №7", meta: "9,820 words" },
      { id: "d-3", title: "Cornhill Magazine — №2", meta: "11,140 words" },
    ],
  },
  {
    id: "p-2",
    name: "Spoken Corpus: Service Encounters",
    description: "Politeness strategies in transactional dialogue.",
    language: "Spanish (ES-MX)",
    documents: [
      { id: "d-4", title: "Transcript — Mercado A", meta: "2,310 turns" },
      { id: "d-5", title: "Transcript — Farmacia B", meta: "1,870 turns" },
    ],
  },
  {
    id: "p-3",
    name: "Technical Documentation Drift",
    description: "Lexical density in API references over five releases.",
    language: "English (EN-US)",
    documents: [
      { id: "d-6", title: "v1.0 Reference", meta: "18,200 words" },
      { id: "d-7", title: "v2.0 Reference", meta: "22,540 words" },
      { id: "d-8", title: "v3.0 Reference", meta: "26,900 words" },
      { id: "d-9", title: "Migration Guide", meta: "4,120 words" },
    ],
  },
]

const SEED_OBSERVATIONS: Observation[] = [
  {
    id: "o-1",
    projectId: "p-1",
    documentId: "d-1",
    category: "Register",
    notes:
      "Marked elevation in formality at chapter openings; contracted forms reappear in reported dialogue.",
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
  },
  {
    id: "o-2",
    projectId: "p-1",
    documentId: "d-2",
    category: "Cohesion",
    notes:
      "Heavy reliance on additive conjunctions ('and', 'moreover') to bridge installment gaps.",
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: "o-3",
    projectId: "p-3",
    documentId: "d-8",
    category: "Lexicon",
    notes:
      "Domain-specific noun clusters increase ~18% vs v1.0; fewer hedging verbs overall.",
    createdAt: Date.now() - 1000 * 60 * 90,
  },
]

type WorkspaceContextValue = {
  user: string | null
  login: (email: string) => void
  logout: () => void
  projects: Project[]
  observations: Observation[]
  addObservation: (input: Omit<Observation, "id" | "createdAt">) => void
  getProject: (id: string) => Project | undefined
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null)
  const [projects] = useState<Project[]>(SEED_PROJECTS)
  const [observations, setObservations] =
    useState<Observation[]>(SEED_OBSERVATIONS)

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      user,
      login: (email) => setUser(email),
      logout: () => setUser(null),
      projects,
      observations,
      addObservation: (input) =>
        setObservations((prev) => [
          {
            ...input,
            id: `o-${Date.now()}`,
            createdAt: Date.now(),
          },
          ...prev,
        ]),
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
