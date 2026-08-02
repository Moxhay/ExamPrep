'use client'

import { memo, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type SubmitEvent } from 'react'
import { questionTypeHint, questionTypeLabel } from '@/app/lib/questionTypes'
import { useAddQuestion, useUpdateQuestion } from '@/app/lib/examMutations'
import { questionSchema, type QuestionPayload, type WizardQuestion } from '@/app/lib/validation'
import RichTextEditor from '@/app/components/RichTextEditor'
import { IconBlankLine, IconCircleDot, IconLayers, IconPencilLine, IconTrash } from '@/app/components/icons'

export interface ExamWizardQuestionFormProps {
  examId: number
  initialValue: WizardQuestion | null
  onEditingDone: () => void
  onContinue: () => void
  canContinue: boolean
  headerAction?: ReactNode
}

const QUESTION_TYPES: QuestionPayload['type'][] = ['multiple_choice', 'fill_blank', 'written', 'written_multi']

const QUESTION_TYPE_ICON: Record<QuestionPayload['type'], ReactNode> = {
  multiple_choice: <IconCircleDot />,
  fill_blank: <IconBlankLine />,
  written: <IconPencilLine />,
  written_multi: <IconLayers />,
}

const OPTION_LETTERS = 'ABCDEFGH'

interface LocalOption {
  key: string
  text: string
}

interface LocalSubQuestion {
  label: string
  text: string
  placeholder: string
}

interface LocalQuestionState {
  type: QuestionPayload['type']
  title: string
  context: string
  options: LocalOption[]
  placeholder: string
  subQuestions: LocalSubQuestion[]
}

function emptyState(type: QuestionPayload['type']): LocalQuestionState {
  return {
    type,
    title: '',
    context: '',
    options: type === 'multiple_choice' ? [{ key: '1', text: '' }, { key: '2', text: '' }] : [],
    placeholder: '',
    subQuestions: type === 'written_multi' ? [{ label: '', text: '', placeholder: '' }] : [],
  }
}

function stateFromQuestion(q: WizardQuestion): LocalQuestionState {
  return {
    type: q.type,
    title: q.title ?? q.text ?? '',
    context: q.context ?? '',
    options: q.type === 'multiple_choice' ? q.options.map((o, i) => ({ key: String(i + 1), text: o.text })) : [],
    placeholder: q.type === 'written' ? (q.placeholder ?? '') : '',
    subQuestions:
      q.type === 'written_multi' ? q.subQuestions.map((s) => ({ label: s.label, text: s.text ?? '', placeholder: s.placeholder ?? '' })) : [],
  }
}

function buildPayload(local: LocalQuestionState): unknown {
  const title = local.title
  const context = local.context.trim() ? local.context : undefined

  switch (local.type) {
    case 'multiple_choice':
      return { type: local.type, title, text: title, context, options: local.options.filter((o) => o.text.trim()) }
    case 'fill_blank':
      return { type: local.type, title, text: title, context }
    case 'written':
      return { type: local.type, title, text: title, context, placeholder: local.placeholder.trim() || undefined }
    case 'written_multi':
      return {
        type: local.type,
        title,
        text: title,
        context,
        subQuestions: local.subQuestions.map((s) => ({
          label: s.label,
          text: s.text.trim() ? s.text : undefined,
          placeholder: s.placeholder.trim() || undefined,
        })),
      }
  }
}

const INPUT = 'bg-bg rounded-lg px-3.5 py-2.5 text-sm text-dark outline-none shadow-[inset_0_1px_3px_rgba(90,60,30,0.12)] focus:ring-2 focus:ring-primary'

function ExamWizardQuestionForm({
  examId,
  initialValue,
  onEditingDone,
  onContinue,
  canContinue,
  headerAction,
}: ExamWizardQuestionFormProps) {
  const [local, setLocal] = useState<LocalQuestionState>(() =>
    initialValue ? stateFromQuestion(initialValue) : emptyState('multiple_choice')
  )
  const [validationError, setValidationError] = useState<string | null>(null)
  const titleRef = useRef<HTMLTextAreaElement>(null)
  const addQuestion = useAddQuestion(examId)
  const updateQuestion = useUpdateQuestion(examId)

  const isEditing = initialValue !== null
  const submitting = addQuestion.isPending || updateQuestion.isPending
  const apiError = (isEditing ? updateQuestion.error : addQuestion.error)?.message ?? null
  const error = validationError ?? apiError

  useLayoutEffect(() => {
    const el = titleRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [local.title])

  useEffect(() => {
    if (isEditing) titleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [isEditing])

  function updateField<K extends keyof LocalQuestionState>(field: K, value: LocalQuestionState[K]) {
    setLocal((prev) => ({ ...prev, [field]: value }))
  }

  function addOption() {
    setLocal((prev) => ({ ...prev, options: [...prev.options, { key: String(prev.options.length + 1), text: '' }] }))
  }

  function removeOption(key: string) {
    setLocal((prev) => ({ ...prev, options: prev.options.filter((o) => o.key !== key) }))
  }

  function updateOptionText(key: string, text: string) {
    setLocal((prev) => ({ ...prev, options: prev.options.map((o) => (o.key === key ? { ...o, text } : o)) }))
  }

  function addSubQuestion() {
    setLocal((prev) => ({ ...prev, subQuestions: [...prev.subQuestions, { label: '', text: '', placeholder: '' }] }))
  }

  function removeSubQuestion(index: number) {
    setLocal((prev) => ({ ...prev, subQuestions: prev.subQuestions.filter((_, i) => i !== index) }))
  }

  function updateSubQuestion(index: number, patch: Partial<LocalSubQuestion>) {
    setLocal((prev) => ({
      ...prev,
      subQuestions: prev.subQuestions.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    }))
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setValidationError(null)

    const parsed = questionSchema.safeParse(buildPayload(local))

    if (!parsed.success) {
      setValidationError(parsed.error.issues[0].message)
      return
    }

    if (isEditing && initialValue) {
      updateQuestion.mutate({ questionId: initialValue.id, payload: parsed.data }, { onSuccess: onEditingDone })
      return
    }

    addQuestion.mutate(parsed.data, {
      onSuccess: () => setLocal(emptyState(local.type)),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-muted-dark">Question type</p>
          {headerAction}
        </div>
        <div className="grid grid-cols-2 gap-2 max-w-md">
          {QUESTION_TYPES.map((type) => {
            const active = local.type === type
            return (
              <button
                key={type}
                type="button"
                disabled={isEditing}
                onClick={() => setLocal(emptyState(type))}
                className={`flex items-start gap-2.5 px-3.5 py-3 rounded-xl text-left transition-colors disabled:cursor-not-allowed
                  ${active
                    ? 'bg-dark text-white shadow-[0_8px_22px_-14px_rgba(90,60,30,0.3)]'
                    : 'bg-surface text-dark hover:bg-selected-bg shadow-[0_4px_14px_-8px_rgba(90,60,30,0.25)]'}`}
              >
                <span className={active ? 'text-primary mt-0.5' : 'text-muted-dark mt-0.5'}>{QUESTION_TYPE_ICON[type]}</span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold leading-tight">{questionTypeLabel(type)}</span>
                  <span className={`text-[11px] leading-tight ${active ? 'text-white/60' : 'text-muted-dark'}`}>
                    {questionTypeHint(type)}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="bg-surface rounded-xl p-5 shadow-[0_4px_14px_-8px_rgba(90,60,30,0.25)] flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-xs font-semibold text-muted-dark">
            Title
          </label>
          <textarea
            id="title"
            ref={titleRef}
            value={local.title}
            onChange={(e) => updateField('title', e.target.value)}
            required
            rows={1}
            placeholder="Choose the word closest in meaning to the underlined word."
            className={`${INPUT} resize-none overflow-hidden leading-normal`}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-dark">
            {local.type === 'fill_blank' ? 'Word box / passage' : 'Question text (optional)'}
          </label>
          <RichTextEditor
            value={local.context}
            onChange={(value) => updateField('context', value)}
            placeholder={
              local.type === 'fill_blank'
                ? 'Word Box: adapt · evidence · confidence...'
                : 'Paste the reading passage here, if any...'
            }
          />
        </div>

        {local.type === 'multiple_choice' && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-dark">Answer options</label>
            {local.options.map((option, index) => (
              <div key={option.key} className="flex items-start gap-2">
                <span className="w-6 h-6 mt-0.5 rounded-md bg-selected-bg text-primary text-[11px] font-bold flex items-center justify-center shrink-0">
                  {OPTION_LETTERS[index] ?? index + 1}
                </span>
                <div className="flex-1">
                  <RichTextEditor compact value={option.text} onChange={(value) => updateOptionText(option.key, value)} />
                </div>
                {local.options.length > 2 && (
                  <button
                    type="button"
                    aria-label="Remove option"
                    title="Remove option"
                    onClick={() => removeOption(option.key)}
                    className="w-6 h-6 mt-0.5 rounded-md flex items-center justify-center text-muted-dark hover:text-danger hover:bg-bg transition-colors shrink-0"
                  >
                    <IconTrash />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="self-start text-xs font-semibold text-primary hover:text-primary-hover"
            >
              + Add option
            </button>
          </div>
        )}

        {local.type === 'written' && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="placeholder" className="text-xs font-semibold text-muted-dark">
              Answer placeholder
            </label>
            <input
              id="placeholder"
              value={local.placeholder}
              onChange={(e) => updateField('placeholder', e.target.value)}
              placeholder="Write your answer here..."
              className={INPUT}
            />
          </div>
        )}

        {local.type === 'written_multi' && (
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-muted-dark">Sub-questions</label>
            {local.subQuestions.map((sub, i) => (
              <div key={i} className="bg-bg rounded-lg p-3.5 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    value={sub.label}
                    onChange={(e) => updateSubQuestion(i, { label: e.target.value })}
                    placeholder="4.1"
                    className={`${INPUT} w-20`}
                  />
                  {local.subQuestions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSubQuestion(i)}
                      className="text-xs text-muted-dark hover:text-danger ml-auto"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <RichTextEditor compact value={sub.text} onChange={(value) => updateSubQuestion(i, { text: value })} />
                <input
                  value={sub.placeholder}
                  onChange={(e) => updateSubQuestion(i, { placeholder: e.target.value })}
                  placeholder="Write the rewritten sentence here..."
                  className={INPUT}
                />
              </div>
            ))}
            <button type="button" onClick={addSubQuestion} className="self-start text-xs font-semibold text-primary hover:text-primary-hover">
              + Add sub-question
            </button>
          </div>
        )}

        {error && <p className="text-xs text-danger">{error}</p>}

        <div className="flex flex-wrap gap-2">
          {isEditing && (
            <button
              type="button"
              onClick={onEditingDone}
              className="flex-1 bg-bg text-dark py-2.5 rounded-lg text-sm font-bold hover:bg-border transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting || !local.title?.trim()}
            className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving…' : isEditing ? 'Save changes' : '+ Add question'}
          </button>
          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue}
            className="flex-1 bg-dark text-white py-2.5 rounded-lg text-sm font-bold hover:bg-dark/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Continue to publish →
          </button>
        </div>
      </div>
    </form>
  )
}

export default memo(ExamWizardQuestionForm)
