export function Logo({ showText = true }: { showText?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 7V5h16v2" />
          <path d="M12 5v14" />
          <path d="M9 19h6" />
        </svg>
      </div>
      {showText && (
        <span className="text-sm font-semibold tracking-tight">
          Lexicon
        </span>
      )}
    </div>
  )
}
