'use client'

import { useState, type SubmitEvent } from 'react'
import { useRouter } from 'next/navigation'
import { examCreateSchema } from '@/app/lib/validation'
import { useCreateExam } from '@/app/lib/examMutations'
import { EDIT_EXAM_PATH } from '@/app/const'
import RichTextEditor from '@/app/components/RichTextEditor'

const INPUT = 'bg-bg rounded-lg px-3.5 py-2.5 text-sm text-dark outline-none shadow-[inset_0_1px_3px_rgba(90,60,30,0.12)] focus:ring-2 focus:ring-primary'
const TITLE_MAX = 100
const DESCRIPTION_MAX = 200

export default function CreateExamPage() {
  const router = useRouter()
  const createExam = useCreateExam()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setValidationError(null)

    const parsed = examCreateSchema.safeParse({ title, description })

    if (!parsed.success) {
      setValidationError(parsed.error.issues[0].message)
      return
    }

    createExam.mutate(parsed.data, {
      onSuccess: ({ id }) => router.push(`${EDIT_EXAM_PATH}/${id}/questions`),
    })
  }

  const error = validationError ?? (createExam.isError ? createExam.error.message : null)

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
          disabled={createExam.isPending || !title.trim() || !description.trim()}
          className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {createExam.isPending ? 'Saving…' : 'Continue to questions →'}
        </button>
      </form>
    </div>
  )
}
