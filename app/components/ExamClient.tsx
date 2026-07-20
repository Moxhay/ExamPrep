'use client'

import { useState, useCallback, useEffect } from 'react'
import { CHUNK_SIZE, EXAM_DURATION_MINUTES } from '../const'
import type { Exam } from '../types'
import QuestionCard from './QuestionCard'
import Timer from './Timer'
import ExamDialog from './ExamDialog'

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconDownload() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )
}

function IconRefresh() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
    </svg>
  )
}

function IconMenu() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
}

// ─── ExamClient ──────────────────────────────────────────────────────────────

export default function ExamClient({ exam }: { exam: Exam }) {
  const [started, setStarted] = useState(false)
  const [review, setReview] = useState(false)
  const [timeUpAlert, setTimeUpAlert] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [examKey, setExamKey] = useState(0)
  const [answeredSet, setAnsweredSet] = useState<Set<string>>(new Set())
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE)

  const sentinelRef = useCallback((el: HTMLDivElement | null) => {
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisibleCount((n) => Math.min(n + CHUNK_SIZE, exam.questions.length))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [exam.questions.length])

  const locked = !started || review
  const answeredCount = answeredSet.size
  const blocked = !started || timeUpAlert

  useEffect(() => {
    document.body.style.overflow = blocked ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [blocked])

  // Signals Sidebar to hide its floating hamburger (integrated into sticky nav instead)
  useEffect(() => {
    document.dispatchEvent(new CustomEvent(started ? 'exam-started' : 'exam-reset'))
  }, [started])

  const onTimeUp = useCallback(() => {
    setVisibleCount(exam.questions.length)
    setReview(true)
    setTimeUpAlert(true)
  }, [exam.questions.length])

  const onAnsweredChange = useCallback((qId: string, answered: boolean) => {
    setAnsweredSet((prev) => {
      const next = new Set(prev)
      answered ? next.add(qId) : next.delete(qId)
      return next
    })
  }, [])

  function reset() {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setTimerKey((k) => k + 1)
    setExamKey((k) => k + 1)
    setAnsweredSet(new Set())
    setVisibleCount(CHUNK_SIZE)
    setStarted(false)
    setReview(false)
    setTimeUpAlert(false)
  }

  const PAPER_WIDTH = 'w-[92%] sm:w-[90%] max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl min-[2000px]:max-w-6xl'

  return (
    <div className={`relative min-h-screen font-sans bg-stone-100 ${blocked ? 'overflow-hidden' : ''}`}>

      <div className={blocked ? 'blur-sm pointer-events-none select-none opacity-60' : ''}>

        {/* Floating sticky nav */}
        {started && (
          <div className="sticky top-3 z-10 flex justify-center print:hidden">
            <div className={`${PAPER_WIDTH} bg-stone-50/90 backdrop-blur-md shadow-md border border-stone-200/80 rounded-2xl px-4 sm:px-6 py-3`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 min-w-0 mr-3">
                  {/* Hamburger integrated into the nav on mobile/tablet (lg:hidden) */}
                  <button
                    onClick={() => document.dispatchEvent(new CustomEvent('open-mobile-sidebar'))}
                    aria-label="Open menu"
                    className="lg:hidden shrink-0 p-1.5 -ml-1 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200/70 transition-colors"
                  >
                    <IconMenu />
                  </button>
                  <h2 className="text-sm sm:text-base font-bold text-gray-900 truncate">{exam.title}</h2>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                  <span className="text-xs sm:text-sm text-gray-500 tabular-nums">{answeredCount}/{exam.questions.length}</span>
                  {!review && <Timer key={timerKey} onTimeUp={onTimeUp} />}
                </div>
              </div>
              <div className="mt-2 h-1 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-gray-900 rounded-full transition-[width] duration-300"
                  style={{ width: `${(answeredCount / exam.questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Paper */}
        <div className={`${PAPER_WIDTH} mx-auto py-4 sm:py-8 px-0 print:p-0 print:max-w-none print:w-full`}>
          <div className="bg-stone-50 shadow-sm border border-stone-200/70 px-4 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-10 print:shadow-none print:border-none print:px-0 print:py-0">

            {!started && (
              <div className="pb-3 border-b border-gray-200 mb-8">
                <div className="flex justify-between items-center gap-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 pl-9 lg:pl-0">{exam.title}</h2>
                  <span className="text-xs sm:text-sm text-gray-500 shrink-0">0 / {exam.questions.length} answered</span>
                </div>
                <div className="mt-2 h-1 bg-gray-200 rounded-full" />
              </div>
            )}

            <div>
              {exam.questions.slice(0, visibleCount).map((q) => (
                <QuestionCard
                  key={`${examKey}-${q.id}`}
                  q={q}
                  review={review}
                  locked={locked}
                  onAnsweredChange={onAnsweredChange}
                />
              ))}
            </div>

            {visibleCount < exam.questions.length && (
              <div ref={sentinelRef} className="h-10" />
            )}

            {started && !review && (
              <div className="text-center pt-4 pb-6">
                <button
                  onClick={() => { setVisibleCount(exam.questions.length); setReview(true) }}
                  className="w-full sm:w-auto bg-gray-900 text-white py-3.5 px-9 rounded-lg text-base cursor-pointer hover:bg-gray-700 transition-colors"
                >
                  Review answers ({answeredCount}/{exam.questions.length})
                </button>
              </div>
            )}

            {review && <div className="h-20 print:hidden" />}
          </div>
        </div>

      </div>

      {!started && (
        <ExamDialog
          title={exam.title}
          description={exam.description}
          stats={[
            { label: 'Questions', value: exam.questions.length },
            { label: 'Time', value: `${EXAM_DURATION_MINUTES} min` },
          ]}
          note={<>You have <strong className="text-gray-700">{EXAM_DURATION_MINUTES} minutes</strong> to complete the exam. Once started, the timer cannot be paused.</>}
          action={{
            label: 'Start Exam →',
            onClick: () => setStarted(true),
            className: 'w-full bg-gray-900 text-white py-3.5 rounded-xl text-base font-semibold tracking-wide cursor-pointer hover:bg-gray-700 transition-colors',
          }}
        />
      )}

      {timeUpAlert && (
        <>
          <button
            onClick={() => document.dispatchEvent(new CustomEvent('open-mobile-sidebar'))}
            aria-label="Open menu"
            className="lg:hidden fixed top-3 left-3 z-40 p-2 rounded-lg bg-stone-50 border border-stone-200 shadow-sm text-gray-600 hover:text-gray-900 transition-colors print:hidden"
          >
            <IconMenu />
          </button>
          <ExamDialog
            title="Time's Up!"
            description="Your time has ended. Review your answers below."
            stats={[
              { label: 'Answered', value: answeredCount },
              { label: 'Skipped', value: exam.questions.length - answeredCount },
            ]}
            action={{
              label: 'Review Exam →',
              onClick: () => setTimeUpAlert(false),
              className: 'w-full bg-gray-900 text-white py-3.5 rounded-xl text-base font-semibold tracking-wide cursor-pointer hover:bg-gray-700 transition-colors',
            }}
            secondaryActions={[
              {
                label: 'Download PDF',
                onClick: () => { setTimeUpAlert(false); setTimeout(() => window.print(), 50) },
                icon: <IconDownload />,
                className: 'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:text-stone-900 bg-stone-200 hover:bg-stone-300 cursor-pointer transition-colors',
              },
              {
                label: 'Try again',
                onClick: reset,
                icon: <IconRefresh />,
                className: 'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:text-stone-900 bg-stone-200 hover:bg-stone-300 cursor-pointer transition-colors',
              },
            ]}
          />
        </>
      )}

      {review && !timeUpAlert && (
        <div className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 bg-stone-50/90 backdrop-blur-md border border-stone-200/80 shadow-lg rounded-2xl px-3 py-3 print:hidden w-[calc(100%-2rem)] sm:w-auto max-w-xs sm:max-w-none">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors"
          >
            <IconDownload />
            Download PDF
          </button>
          <div className="w-px bg-gray-200 self-stretch" />
          <button
            onClick={reset}
            className="flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-700 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors"
          >
            <IconRefresh />
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
