'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { countQuestionsByType, questionTypeLabel } from '@/app/lib/questionTypes'
import { examDetailsSchema, type QuestionPayload } from '@/app/lib/validation'
import { HOME_PATH, EDIT_EXAM_PATH, EXAM_DURATION_MINUTES } from '@/app/const'
import { examKeys, fetchExamDetail, toDraftView, type ExamDraftView } from '@/app/lib/examQueries'
import { usePublishExam } from '@/app/lib/examMutations'
import { IconBlankLine, IconCheck, IconCircleDot, IconLayers, IconPencilLine } from '@/app/components/icons'
import ExamWizardPublishSkeleton from '@/app/components/ExamWizardPublishSkeleton'

const TYPE_ICON: Record<QuestionPayload['type'], ReactNode> = {
  multiple_choice: <IconCircleDot />,
  fill_blank: <IconBlankLine />,
  written: <IconPencilLine />,
  written_multi: <IconLayers />,
}

export default function ExamWizardPublishStep({ examId }: { examId: number }) {
  const { data: draft, isPending, isError } = useQuery({
    queryKey: examKeys.detail(examId),
    queryFn: () => fetchExamDetail(examId),
    select: toDraftView,
  })

  if (isPending) return <ExamWizardPublishSkeleton />
  if (isError) return <p className="text-sm text-danger text-center">Couldn&apos;t load the exam. Please try again.</p>

  return <ExamWizardPublishForm examId={examId} draft={draft} />
}

function ExamWizardPublishForm({ examId, draft }: { examId: number; draft: ExamDraftView }) {
  const router = useRouter()
  const publishExam = usePublishExam(examId)
  const [isPublished, setIsPublished] = useState(draft.isPublished)
  const [success, setSuccess] = useState(false)

  const basePath = `${EDIT_EXAM_PATH}/${examId}`
  const counts = countQuestionsByType(draft.questions)

  function handlePublish() {
    const parsed = examDetailsSchema.safeParse({ title: draft.title, description: draft.description, isPublished })
    if (!parsed.success) return

    publishExam.mutate(parsed.data, { onSuccess: () => setSuccess(true) })
  }

  return (
    <div className="bg-surface rounded-2xl p-8 shadow-[0_8px_22px_-14px_rgba(90,60,30,0.3)] max-w-xl mx-auto flex flex-col gap-5">
      <div>
        <h2 className="font-display font-bold text-base text-dark mb-1">{draft.title}</h2>
        <p className="text-xs text-muted-dark">
          {EXAM_DURATION_MINUTES} min · {draft.questions.length} question{draft.questions.length === 1 ? '' : 's'}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        {(['multiple_choice', 'fill_blank', 'written', 'written_multi'] as const).map((type) => (
          <div key={type} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-bg text-sm">
            <span className="text-muted-dark">{TYPE_ICON[type]}</span>
            <span className="text-muted-dark flex-1">{questionTypeLabel(type)}</span>
            <span className="font-bold text-dark">{counts[type]}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={isPublished}
        onClick={() => setIsPublished((v) => !v)}
        className="flex items-center justify-between gap-3 text-sm text-dark"
      >
        <span className="font-semibold">Visible to students</span>
        <span
          className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${isPublished ? 'bg-primary' : 'bg-border'}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-[0_2px_4px_rgba(90,60,30,0.3)] transition-transform ${isPublished ? 'translate-x-4' : 'translate-x-0'}`}
          />
        </span>
      </button>

      {publishExam.isError && <p className="text-xs text-danger">{publishExam.error.message}</p>}

      {success ? (
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="w-11 h-11 rounded-full bg-selected-bg text-primary flex items-center justify-center">
            <IconCheck />
          </span>
          <p className="text-sm font-semibold text-dark">Exam saved</p>
          <Link
            href={HOME_PATH}
            className="w-full text-center bg-dark text-white py-2.5 rounded-lg text-sm font-bold hover:bg-dark/90 transition-colors"
          >
            Back to home
          </Link>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push(`${basePath}/questions`)}
            className="flex-1 bg-surface text-dark border border-border py-2.5 rounded-lg text-sm font-bold hover:bg-bg transition-colors"
          >
            ← Keep editing
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={publishExam.isPending}
            className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {publishExam.isPending ? 'Publishing…' : 'Publish exam ✓'}
          </button>
        </div>
      )}
    </div>
  )
}
