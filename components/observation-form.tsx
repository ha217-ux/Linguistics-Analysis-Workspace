"use client"

import { useState } from "react"
import {
  CATEGORIES,
  useWorkspace,
  type Category,
  type Project,
} from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ChevronDown, Plus } from "lucide-react"

const selectClass =
  "h-10 w-full appearance-none rounded-md border border-input bg-background px-3 pr-9 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"

export function ObservationForm({
  project,
  selectedDocId,
  onDocChange,
}: {
  project: Project
  selectedDocId: string
  onDocChange: (id: string) => void
}) {
  const { addObservation } = useWorkspace()
  const [category, setCategory] = useState<Category>("Syntax")
  const [notes, setNotes] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedDocId || !notes.trim()) return
    addObservation({
      projectId: project.id,
      documentId: selectedDocId,
      category,
      notes: notes.trim(),
    })
    setNotes("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-5"
    >
      <h2 className="text-sm font-semibold">Log a new observation</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Record a finding against a document in this project.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="document"
            className="text-xs font-medium text-muted-foreground"
          >
            Document
          </label>
          <div className="relative">
            <select
              id="document"
              value={selectedDocId}
              onChange={(e) => onDocChange(e.target.value)}
              className={selectClass}
            >
              {project.documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.title}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="category"
            className="text-xs font-medium text-muted-foreground"
          >
            Category
          </label>
          <div className="relative">
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className={selectClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        <label
          htmlFor="notes"
          className="text-xs font-medium text-muted-foreground"
        >
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Describe the linguistic feature, where it occurs, and its significance…"
          className="resize-y rounded-md border border-input bg-background px-3 py-2 text-sm leading-relaxed outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Button type="submit" className="gap-1.5" disabled={!notes.trim()}>
          <Plus className="size-4" />
          Save observation
        </Button>
      </div>
    </form>
  )
}
