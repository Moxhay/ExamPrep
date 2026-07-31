function ExamCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl p-5 shadow-[0_8px_22px_-14px_rgba(90,60,30,0.3)] animate-pulse">
      <div className="h-4 w-2/3 rounded bg-border mb-4" />
      <div className="h-3 w-1/2 rounded bg-border mb-4" />
      <div className="h-9 rounded-lg bg-border" />
    </div>
  )
}

export default function ExamsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <ExamCardSkeleton key={i} />
      ))}
    </div>
  )
}
