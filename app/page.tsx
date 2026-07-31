import {Suspense} from 'react'
import ExamGrid from '@/app/components/ExamGrid'
import ExamsSkeleton from '@/app/components/ExamsSkeleton'

export default function Home() {

  return (
    <div className="flex-1 bg-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-dark mb-1.5">Hello 👋</h1>
        <p className="text-sm text-muted-dark mb-6 sm:mb-8">Choose an exam to get started</p>
        <Suspense fallback={<ExamsSkeleton />}>
          <ExamGrid />
        </Suspense>
      </div>
    </div>
  )
}
