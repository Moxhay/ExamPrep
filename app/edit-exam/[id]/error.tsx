'use client'

import Link from 'next/link'
import { HOME_PATH } from '@/app/const'

export default function EditExamError({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center gap-3 text-center px-4">
      <p className="font-display text-lg font-bold text-dark">Exam not found</p>
      <p className="text-sm text-muted-dark">It may have been deleted or the link is incorrect.</p>
      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={() => unstable_retry()}
          className="bg-surface text-dark border border-border py-2.5 px-6 rounded-lg text-sm font-bold hover:bg-bg transition-colors"
        >
          Try again
        </button>
        <Link
          href={HOME_PATH}
          className="bg-dark text-white py-2.5 px-6 rounded-lg text-sm font-bold hover:bg-dark/90 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
