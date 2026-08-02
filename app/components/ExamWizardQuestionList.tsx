'use client'

import type { ReactNode } from 'react'
import { memo } from 'react'
import { parseInline } from '@/app/lib/parseInline'
import { questionTypeLabel } from '@/app/lib/questionTypes'
import { useDeleteQuestion } from '@/app/lib/examMutations'
import type { QuestionPayload, WizardQuestion } from '@/app/lib/validation'
import { IconBlankLine, IconCircleDot, IconLayers, IconPencilLine } from '@/app/components/icons'

const TYPE_ICON: Record<QuestionPayload['type'], ReactNode> = {
  multiple_choice: <IconCircleDot />,
  fill_blank: <IconBlankLine />,
  written: <IconPencilLine />,
  written_multi: <IconLayers />,
}

export interface ExamWizardQuestionListProps {
  examId: number
  questions: WizardQuestion[]
  editingQuestionId: number | null
  onEdit: (questionId: number) => void
}

function ExamWizardQuestionList({ examId, questions, editingQuestionId, onEdit }: ExamWizardQuestionListProps) {
  const deleteQuestion = useDeleteQuestion(examId)

  function handleDelete(questionId: number) {
    if (!confirm('Delete this question?')) return
    deleteQuestion.mutate(questionId)
  }

  if (questions.length === 0) {
    return <p className="text-sm text-muted italic">No questions added yet.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {deleteQuestion.isError && <p className="text-xs text-danger">{deleteQuestion.error.message}</p>}
      {questions.map((q) => {
        const isDeleting = deleteQuestion.isPending && deleteQuestion.variables === q.id
        return (
          <div
            key={q.id}
            className={`bg-surface rounded-xl px-4 py-3.5 shadow-[0_4px_14px_-8px_rgba(90,60,30,0.25)]
              ${editingQuestionId === q.id ? 'ring-2 ring-primary' : ''}`}
          >
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 mt-0.5 rounded-lg bg-selected-bg text-primary flex items-center justify-center shrink-0">
                {TYPE_ICON[q.type]}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-dark font-semibold flex-1">
                    {q.number}) {q.title}
                  </p>
                  <div className="flex items-center gap-3 shrink-0">
                    <button type="button" onClick={() => onEdit(q.id)} className="text-xs font-semibold text-primary hover:text-primary-hover">
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(q.id)}
                      disabled={isDeleting}
                      className="text-xs font-semibold text-muted-dark hover:text-danger disabled:opacity-50"
                    >
                      {isDeleting ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </div>
                {q.context && <p className="text-xs text-dark mt-1 line-clamp-2">{parseInline(q.context)}</p>}
                <p className="text-xs text-muted-dark mt-1">{questionTypeLabel(q.type)}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default memo(ExamWizardQuestionList)
