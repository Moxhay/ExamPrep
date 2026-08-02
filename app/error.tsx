'use client'

export default function RootError({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
      <p className="font-display text-lg font-bold text-dark">Something went wrong</p>
      <p className="text-sm text-muted-dark">Couldn&apos;t load this page. Please try again.</p>
      <button
        onClick={() => unstable_retry()}
        className="mt-2 bg-dark text-white py-2.5 px-6 rounded-lg text-sm font-bold hover:bg-dark/90 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
