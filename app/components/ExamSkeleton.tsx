export default function ExamSkeleton() {
  return (
    <div className="font-sans bg-bg">
      <div className="max-w-6xl mx-auto animate-pulse">
        <div className="sticky top-16 z-10 bg-bg pt-4 sm:pt-6">
          <div className="flex justify-between items-center gap-3 px-4 sm:px-6 pb-3">
            <div className="h-4 w-40 rounded bg-border" />
            <div className="h-6 w-16 rounded-full bg-border" />
          </div>
          <div className="h-1 rounded-full bg-border mx-4 sm:mx-6" />
        </div>

        <div className="px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-xl shadow-[0_4px_14px_-8px_rgba(90,60,30,0.25)] p-5 flex flex-col gap-3">
              <div className="h-4 w-2/3 rounded bg-border" />
              <div className="h-16 rounded-lg bg-bg" />
              <div className="h-10 rounded-lg bg-bg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
