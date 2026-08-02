export default function ExamWizardQuestionsSkeleton() {
  return (
    <div className="pl-3">
      <div className="grid md:grid-cols-[minmax(0,1fr)_340px] gap-8">
        <div className="flex flex-col gap-5 animate-pulse">
          <div>
            <div className="h-3 w-28 rounded bg-border mb-2" />
            <div className="grid grid-cols-2 gap-2 max-w-md">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[62px] rounded-xl bg-surface" />
              ))}
            </div>
          </div>
          <div className="bg-surface rounded-xl p-5 shadow-[0_4px_14px_-8px_rgba(90,60,30,0.25)] flex flex-col gap-4">
            <div className="h-3 w-14 rounded bg-border" />
            <div className="h-10 rounded-lg bg-border" />
            <div className="h-3 w-40 rounded bg-border" />
            <div className="h-28 rounded-lg bg-border" />
            <div className="h-10 rounded-lg bg-border" />
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-pulse">
          <div className="bg-surface rounded-xl p-4 shadow-[0_4px_14px_-8px_rgba(90,60,30,0.25)] h-32" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-xl h-20 shadow-[0_4px_14px_-8px_rgba(90,60,30,0.25)]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}