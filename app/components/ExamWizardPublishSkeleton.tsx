export default function ExamWizardPublishSkeleton() {
  return (
    <div className="bg-surface rounded-2xl p-8 shadow-[0_8px_22px_-14px_rgba(90,60,30,0.3)] max-w-xl mx-auto flex flex-col gap-5 animate-pulse">
      <div>
        <div className="h-4 w-2/3 rounded bg-border mb-2" />
        <div className="h-3 w-1/3 rounded bg-border" />
      </div>

      <div className="flex flex-col gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 rounded-lg bg-bg" />
        ))}
      </div>

      <div className="h-6 rounded bg-border" />

      <div className="flex gap-3">
        <div className="flex-1 h-10 rounded-lg bg-border" />
        <div className="flex-1 h-10 rounded-lg bg-border" />
      </div>
    </div>
  )
}