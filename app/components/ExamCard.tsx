'use client'

import Link from 'next/link'
import { EXAM_PATH, EDIT_EXAM_PATH } from '@/app/const'
import { useDeleteExam } from '@/app/lib/examMutations'
import { parseInline } from '@/app/lib/parseInline'
import { IconPencilLine, IconTrash } from '@/app/components/icons'

export interface ExamCardProps {
  id: number
  title: string
  description: string | null
  isPublished: boolean
  isTeacher: boolean
}

export default function ExamCard({ id, title, description, isPublished, isTeacher }: ExamCardProps) {
  const deleteExam = useDeleteExam()

  function handleDelete() {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return
    deleteExam.mutate(id)
  }

  return (
    <div className="bg-surface rounded-2xl p-5 shadow-[0_8px_22px_-14px_rgba(90,60,30,0.3)] flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-3.5">
        <div className="font-display font-bold text-base text-dark line-clamp-1">{title}</div>
        {isTeacher && (
          <span
            className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full ${isPublished ? 'bg-selected-bg text-primary' : 'bg-bg text-muted-dark'}`}
          >
            {isPublished ? 'Visible' : 'Draft'}
          </span>
        )}
      </div>

      <div className="text-xs text-muted mb-4 flex-1 line-clamp-2">{description ? parseInline(description) : null}</div>

      {deleteExam.isError && <p className="text-xs text-danger mb-2">{deleteExam.error.message}</p>}

      {isTeacher ? (
        <div className="flex items-center gap-2">
          <Link
            href={`${EXAM_PATH}?exam=${id}`}
            className="flex-1 text-center bg-primary text-white py-2.5 rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors"
          >
            Preview
          </Link>
          <Link
            href={`${EDIT_EXAM_PATH}/${id}`}
            aria-label="Edit exam"
            title="Edit exam"
            className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-muted-dark hover:text-primary hover:bg-bg transition-colors"
          >
            <IconPencilLine />
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteExam.isPending}
            aria-label="Delete exam"
            title="Delete exam"
            className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-danger hover:bg-bg transition-colors disabled:opacity-50"
          >
            <IconTrash />
          </button>
        </div>
      ) : (
        <Link
          href={`${EXAM_PATH}?exam=${id}`}
          className="block text-center bg-primary text-white py-2.5 rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors"
        >
          Start
        </Link>
      )}
    </div>
  )
}
