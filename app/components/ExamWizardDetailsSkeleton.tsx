export default function ExamWizardDetailsSkeleton() {
  return (
    <div className="min-h-[65vh] flex items-center justify-center">
      <div className="bg-surface rounded-2xl p-10 shadow-[0_8px_22px_-14px_rgba(90,60,30,0.3)] max-w-3xl w-full flex flex-col gap-6 animate-pulse">
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-20 rounded bg-border" />
          <div className="h-10 rounded-lg bg-border" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-24 rounded bg-border" />
          <div className="h-32 rounded-lg bg-border" />
        </div>
        <div className="h-10 rounded-lg bg-border" />
      </div>
    </div>
  )
}