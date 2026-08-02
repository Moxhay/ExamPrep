'use client'

import { useState, type SubmitEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { examDetailsSchema } from '@/app/lib/validation'
import { examKeys, fetchExamDetail, toDraftView, type ExamDraftView } from '@/app/lib/examQueries'
import { useUpdateExamDetails } from '@/app/lib/examMutations'
import { EDIT_EXAM_PATH } from '@/app/const'
import RichTextEditor from '@/app/components/RichTextEditor'
import ExamWizardDetailsSkeleton from '@/app/components/ExamWizardDetailsSkeleton'

const INPUT = 'bg-bg rounded-lg px-3.5 py-2.5 text-sm text-dark outline-none shadow-[inset_0_1px_3px_rgba(90,60,30,0.12)] focus:ring-2 focus:ring-primary'
const TITLE_MAX = 100
const DESCRIPTION_MAX = 200

export default function ExamWizardDetailsStep({ examId }: { examId: number }) {
  const { data: draft, isPending, isError } = useQuery({
    queryKey: examKeys.detail(examId),
    queryFn: () => fetchExamDetail(examId),
    select: toDraftView,
  })

  if (isPending) return <ExamWizardDetailsSkeleton />
  if (isError) return <p className="text-sm text-danger text-center">Couldn&apos;t load the exam. Please try again.</p>

  return <ExamWizardDetailsForm examId={examId} draft={draft} />
}

function ExamWizardDetailsForm({ examId, draft }: { examId: number; draft: ExamDraftView }) {
  const router = useRouter()
  const updateDetails = useUpdateExamDetails(examId)
  const [title, setTitle] = useState(draft.title)
  const [description, setDescription] = useState(draft.description)
  const [validationError, setValidationError] = useState<string | null>(null)

  const basePath = `${EDIT_EXAM_PATH}/${examId}`

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setValidationError(null)

    const parsed = examDetailsSchema.safeParse({ title, description, isPublished: draft.isPublished })

    if (!parsed.success) {
      setValidationError(parsed.error.issues[0].message)
      return
    }

    updateDetails.mutate(parsed.data, { onSuccess: () => router.push(`${basePath}/questions`) })
  }

  const error = validationError ?? (updateDetails.isError ? updateDetails.error.message : null)

  return (
    <div className="min-h-[65vh] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-surface rounded-2xl p-10 shadow-[0_8px_22px_-14px_rgba(90,60,30,0.3)] max-w-3xl w-full flex flex-col gap-6"
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between">
            <label htmlFor="title" className="text-xs font-semibold text-muted-dark">
              Exam name
            </label>
            <span className={`text-[10px] ${title.length > TITLE_MAX ? 'text-danger' : 'text-muted'}`}>
              {title.length}/{TITLE_MAX}
            </span>
          </div>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={TITLE_MAX}
            placeholder="Exam 7 — Business English"
            className={INPUT}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between">
            <label className="text-xs font-semibold text-muted-dark">Description</label>
            <span className={`text-[10px] ${description.length > DESCRIPTION_MAX ? 'text-danger' : 'text-muted'}`}>
              {description.length}/{DESCRIPTION_MAX}
            </span>
          </div>
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder="25 multiple choice + 6 written · 50 min"
          />
        </div>

        {error && <p className="text-xs text-danger">{error}</p>}

        <button
          type="submit"
          disabled={updateDetails.isPending || !title.trim() || !description.trim()}
          className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {updateDetails.isPending ? 'Saving…' : 'Continue to questions →'}
        </button>
      </form>
    </div>
  )
}
