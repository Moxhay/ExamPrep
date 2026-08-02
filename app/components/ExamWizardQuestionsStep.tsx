'use client'

import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import ExamWizardQuestionForm from '@/app/components/ExamWizardQuestionForm'
import ExamWizardQuestionList from '@/app/components/ExamWizardQuestionList'
import ExamWizardQuestionsSkeleton from '@/app/components/ExamWizardQuestionsSkeleton'
import { countQuestionsByType, questionTypeLabel } from '@/app/lib/questionTypes'
import type { QuestionPayload } from '@/app/lib/validation'
import { examKeys, fetchExamDetail, toDraftView, type ExamDraftView } from '@/app/lib/examQueries'
import { EDIT_EXAM_PATH } from '@/app/const'
import { IconBlankLine, IconCircleDot, IconLayers, IconPencilLine } from '@/app/components/icons'

const TYPE_ORDER: QuestionPayload['type'][] = ['multiple_choice', 'fill_blank', 'written', 'written_multi']

const TYPE_ICON: Record<QuestionPayload['type'], ReactNode> = {
  multiple_choice: <IconCircleDot />,
  fill_blank: <IconBlankLine />,
  written: <IconPencilLine />,
  written_multi: <IconLayers />,
}

export default function ExamWizardQuestionsStep({ examId }: { examId: number }) {
  const { data: draft, isPending, isError } = useQuery({
    queryKey: examKeys.detail(examId),
    queryFn: () => fetchExamDetail(examId),
    select: toDraftView,
  })

  if (isPending) return <ExamWizardQuestionsSkeleton />
  if (isError) return <p className="text-sm text-danger text-center">Couldn&apos;t load the exam. Please try again.</p>

  return <ExamWizardQuestionsForm examId={examId} draft={draft} />
}

function ExamWizardQuestionsForm({ examId, draft }: { examId: number; draft: ExamDraftView }) {
  const router = useRouter()
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null)
  const [hidden, setHidden] = useState(false)

  const editingQuestion = useMemo(
    () => draft.questions.find((q) => q.id === editingQuestionId) ?? null,
    [draft.questions, editingQuestionId]
  )
  const counts = useMemo(() => countQuestionsByType(draft.questions), [draft.questions])

  const basePath = `${EDIT_EXAM_PATH}/${examId}`
  const handleEditingDone = useCallback(() => setEditingQuestionId(null), [])
  const handleContinue = useCallback(() => router.push(`${basePath}/publish`), [router, basePath])
  const showQuestionList = useCallback(() => setHidden(false), [])
  const hideQuestionList = useCallback(() => setHidden(true), [])

  const hasQuestions = draft.questions.length > 0
  const showSidebar = hasQuestions && !hidden

  const headerAction = useMemo(
    () =>
      hidden && hasQuestions ? (
        <button
          type="button"
          onClick={showQuestionList}
          className="text-[11px] font-semibold text-primary hover:text-primary-hover"
        >
          Show question list ({draft.questions.length})
        </button>
      ) : undefined,
    [hidden, hasQuestions, showQuestionList, draft.questions.length]
  )

  return (
    <div className="pl-3">
      <div className={showSidebar ? 'grid md:grid-cols-[minmax(0,1fr)_340px] gap-8' : 'grid grid-cols-1 gap-8'}>
        <div>
          <ExamWizardQuestionForm
            key={editingQuestionId ?? 'new'}
            examId={examId}
            initialValue={editingQuestion}
            onEditingDone={handleEditingDone}
            onContinue={handleContinue}
            canContinue={hasQuestions}
            headerAction={headerAction}
          />
        </div>

        {showSidebar && (
          <div className="flex flex-col gap-4 md:sticky md:top-40 md:self-start">
            <div>
              <p className="hidden md:block invisible text-xs font-semibold text-muted-dark mb-2" aria-hidden="true">
                Question type
              </p>
              <div className="bg-surface rounded-xl p-4 shadow-[0_4px_14px_-8px_rgba(90,60,30,0.25)] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-dark">
                    {draft.questions.length} question{draft.questions.length === 1 ? '' : 's'} added
                  </p>
                  <button
                    type="button"
                    onClick={hideQuestionList}
                    className="text-[11px] font-semibold text-muted-dark hover:text-dark"
                  >
                    Hide
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {TYPE_ORDER.map((type) => (
                    <div key={type} className="flex flex-col gap-1 px-3 py-2.5 rounded-lg bg-bg">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-dark">{TYPE_ICON[type]}</span>
                        <span className="text-base font-bold text-dark">{counts[type]}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-muted-dark leading-tight">{questionTypeLabel(type)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <ExamWizardQuestionList
              examId={examId}
              questions={draft.questions}
              editingQuestionId={editingQuestionId}
              onEdit={setEditingQuestionId}
            />
          </div>
        )}
      </div>
    </div>
  )
}
