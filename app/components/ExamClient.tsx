'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { HOME_PATH } from '@/app/const'
import QuestionCard from '@/app/components/QuestionCard'
import Timer from '@/app/components/Timer'
import ExamSkeleton from '@/app/components/ExamSkeleton'
import { IconDownload, IconRefresh, IconClock } from '@/app/components/icons'
import { examKeys, fetchExamDetail } from '@/app/lib/examQueries'
import { examDetailToExam } from '@/app/lib/examMapper'

export default function ExamClient({ examId }: { examId: number }) {
  const { data: exam, isPending, isError } = useQuery({
    queryKey: examKeys.detail(examId),
    queryFn: () => fetchExamDetail(examId),
    select: examDetailToExam,
  })
  const [review, setReview] = useState(false)
  const [timeUp, setTimeUp] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [examKey, setExamKey] = useState(0)
  const [answeredSet, setAnsweredSet] = useState<Set<string>>(new Set())

  const locked = review
  const answeredCount = answeredSet.size

  const onTimeUp = useCallback(() => {
    setReview(true)
    setTimeUp(true)
  }, [])

  const onAnsweredChange = useCallback((qId: string, answered: boolean) => {
    setAnsweredSet((prev) => {
      const next = new Set(prev)
      if (answered) next.add(qId)
      else next.delete(qId)
      return next
    })
  }, [])

  if (isPending) return <ExamSkeleton />
  if (isError) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="font-display text-lg font-bold text-dark">Exam not found</p>
        <p className="text-sm text-muted-dark">It may have been deleted or the link is incorrect.</p>
        <Link
          href={HOME_PATH}
          className="mt-2 bg-dark text-white py-2.5 px-6 rounded-lg text-sm font-bold hover:bg-dark/90 transition-colors"
        >
          Back to home
        </Link>
      </div>
    )
  }

  function reset() {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setTimerKey((k) => k + 1)
    setExamKey((k) => k + 1)
    setAnsweredSet(new Set())
    setReview(false)
    setTimeUp(false)
  }

  return (
    <div className="font-sans bg-bg">
      <div className="max-w-6xl mx-auto print:p-0 print:max-w-none print:w-full">

        <div className="sticky top-16 z-10 bg-bg pt-4 sm:pt-6 print:hidden">
          <div className="flex justify-between items-center gap-3 px-4 sm:px-6 pb-3">
            <div className="flex items-center gap-3 min-w-0">
              <Link href={HOME_PATH} className="shrink-0 text-xs sm:text-sm font-semibold text-muted hover:text-primary transition-colors">
                ← Exams
              </Link>
              <h2 className="font-display text-sm sm:text-base font-bold text-dark truncate">{exam.title}</h2>
            </div>
            <div className="flex items-center gap-3 sm:gap-3.5 shrink-0">
              <span className="text-xs sm:text-sm text-muted tabular-nums">{answeredCount}/{exam.questions.length}</span>
              {!review && <Timer key={timerKey} onTimeUp={onTimeUp} />}
            </div>
          </div>
          <div className="h-1 rounded-full bg-border overflow-hidden mx-4 sm:mx-6">
            <div
              className="h-full bg-primary rounded-full transition-[width] duration-300"
              style={{ width: `${(answeredCount / exam.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {timeUp && (
          <div className="flex items-center gap-2 mt-5 mx-4 sm:mx-6 px-4 py-3 rounded-xl bg-selected-bg text-sm font-semibold text-primary print:hidden">
            <IconClock />
            Time&apos;s up — here&apos;s a review of your answers.
          </div>
        )}

        <div className="px-4 sm:px-6 py-6 sm:py-8 print:py-0">
          {exam.questions.map((q) => (
            <QuestionCard
              key={`${examKey}-${q.id}`}
              q={q}
              review={review}
              locked={locked}
              onAnsweredChange={onAnsweredChange}
            />
          ))}
        </div>

        {!review && (
          <div className="px-4 sm:px-6 pb-10 sm:pb-14 flex justify-center print:hidden">
            <button
              onClick={() => setReview(true)}
              className="w-full sm:w-auto bg-dark text-white py-3.5 px-9 rounded-lg text-base cursor-pointer hover:bg-dark/90 transition-colors"
            >
              Review answers ({answeredCount}/{exam.questions.length})
            </button>
          </div>
        )}
      </div>

      {review && (
        <div className="fixed bottom-4 sm:bottom-8 inset-x-0 mx-auto w-fit max-w-[calc(100%-2rem)] flex gap-2 bg-surface/90 backdrop-blur-md border border-border shadow-[0_10px_30px_-12px_rgba(90,60,30,0.35)] rounded-2xl px-3 py-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 text-muted-dark hover:text-dark hover:bg-bg px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors"
          >
            <IconDownload />
            Download PDF
          </button>
          <div className="w-px bg-border self-stretch" />
          <button
            onClick={reset}
            className="flex items-center gap-2 bg-dark text-white hover:bg-dark/90 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors"
          >
            <IconRefresh />
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
