'use client'

import { useState, useRef, useEffect, memo } from 'react'
import type { Question } from '@/app/types'
import { parseInline } from '@/app/lib/parseInline'

export interface QuestionCardProps {
  q: Question
  review: boolean
  locked: boolean
  onAnsweredChange: (qId: string, answered: boolean) => void
}

const CARD = 'bg-surface rounded-xl shadow-[0_4px_14px_-8px_rgba(90,60,30,0.25)]'

const QuestionCard = memo(function QuestionCard({ q, review, locked, onAnsweredChange }: QuestionCardProps) {
  const [answer, setAnswer] = useState('')
  const [blankAnswer, setBlankAnswer] = useState<string[]>([])
  const [subAnswers, setSubAnswers] = useState<string[]>([])

  const isAnswered =
    q.type === 'fill_blank'     ? blankAnswer.some((v) => v?.trim())
    : q.type === 'written_multi' ? subAnswers.some((v) => v?.trim())
    : !!answer.trim()

  const prevAnsweredRef = useRef(false)
  useEffect(() => {
    if (isAnswered !== prevAnsweredRef.current) {
      prevAnsweredRef.current = isAnswered
      onAnsweredChange(q.id, isAnswered)
    }
  }, [isAnswered, q.id, onAnsweredChange])

  function handleBlankChange(idx: number, val: string) {
    if (locked) return
    setBlankAnswer((prev) => { const a = [...prev]; a[idx] = val; return a })
  }

  function handleSubChange(idx: number, val: string) {
    if (locked) return
    setSubAnswers((prev) => { const a = [...prev]; a[idx] = val; return a })
  }

  function renderInlineBlanks(context: string) {
    const parts = context.split('__________')
    return (
      <>
        {parts.map((part, i) => (
          <span key={i}>
            {parseInline(part)}
            {i < parts.length - 1 && (
              review ? (
                <span className={`inline-block min-w-14 sm:min-w-18 border-b border-dashed px-1 mx-0.5 text-center ${
                  blankAnswer[i]?.trim() ? 'border-dark text-dark font-semibold' : 'border-muted text-muted italic'
                }`}>
                  {blankAnswer[i] || '···'}
                </span>
              ) : (
                <input
                  key={i}
                  type="text"
                  value={blankAnswer[i] ?? ''}
                  onChange={(e) => handleBlankChange(i, e.target.value)}
                  readOnly={locked}
                  className={`inline-block w-20 sm:w-28 max-w-[45%] bg-transparent border-0 border-b border-dashed text-sm text-dark text-center outline-none px-1 mx-0.5 font-sans ${
                    locked ? 'border-border cursor-not-allowed' : 'border-muted cursor-text'
                  }`}
                />
              )
            )}
          </span>
        ))}
      </>
    )
  }

  const unanswered = !isAnswered

  return (
    <div className="mb-6">
      <div className={`text-base font-semibold text-dark whitespace-pre-wrap ${q.context ? 'mb-3' : 'mb-3.5'}`}>
        <span className="mr-1">{q.number})</span>
        {parseInline(q.text)}
      </div>

      {q.context && (
        <div className={`${CARD} px-4 sm:px-5 py-3.5 sm:py-4 text-sm text-dark mb-4 leading-relaxed whitespace-pre-wrap`}>
          {q.type === 'fill_blank' ? renderInlineBlanks(q.context) : parseInline(q.context)}
        </div>
      )}

      {q.type === 'multiple_choice' && q.options && (
        <div className="flex flex-col gap-3">
          {q.options.map((opt) => {
            const selected = answer === opt.id
            return review ? (
              <div
                key={opt.id}
                className={`${CARD} flex items-center gap-3 px-4 sm:px-5 py-3 text-sm text-dark
                  ${selected ? 'ring-2 ring-primary' : ''}`}
              >
                <span className={`w-4 h-4 rounded-full border-2 shrink-0 ${selected ? 'border-primary bg-primary' : 'border-border'}`} />
                {parseInline(opt.text)}
                {selected && <span className="ml-auto text-xs font-semibold text-primary">← your answer</span>}
              </div>
            ) : (
              <label
                key={opt.id}
                className={`${CARD} flex items-center gap-3 px-4 sm:px-5 py-3 transition-shadow
                  ${selected ? 'ring-2 ring-primary' : ''}
                  ${locked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:shadow-[0_6px_18px_-8px_rgba(90,60,30,0.35)]'}`}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={opt.id}
                  checked={selected}
                  onChange={() => !locked && setAnswer(opt.id)}
                  className="accent-primary"
                />
                <span className="text-sm text-dark">{parseInline(opt.text)}</span>
              </label>
            )
          })}
          {review && unanswered && (
            <p className="text-xs text-muted italic">No answer selected</p>
          )}
        </div>
      )}

      {q.type === 'written' && (
        review ? (
          <div className={`${CARD} px-4 sm:px-5 py-3.5 text-sm min-h-12 whitespace-pre-wrap
            ${unanswered ? 'text-muted italic' : 'text-dark'}`}>
            {unanswered ? 'No answer written' : answer}
          </div>
        ) : (
          <textarea
            rows={4}
            value={answer}
            onChange={(e) => !locked && setAnswer(e.target.value)}
            readOnly={locked}
            placeholder={q.placeholder ?? 'Write your answer here...'}
            className={`${CARD} w-full px-4 sm:px-5 py-3.5 text-sm resize-y outline-none font-sans text-dark
              ${locked ? 'cursor-not-allowed opacity-60' : 'cursor-text'}`}
          />
        )
      )}

      {q.type === 'written_multi' && (
        <div className="flex flex-col gap-4">
          {(q.subQuestions ?? []).map((sub, i) => {
            const subAnswer = subAnswers[i]
            return (
              <div key={i}>
                <p className="text-xs font-semibold text-muted-dark mb-1.5">{sub.label}</p>
                {sub.text && (
                  <div className="text-sm text-dark mb-2 whitespace-pre-wrap leading-relaxed">
                    {parseInline(sub.text)}
                  </div>
                )}
                {review ? (
                  <div className={`${CARD} px-4 sm:px-5 py-3 text-sm whitespace-pre-wrap
                    ${subAnswer?.trim() ? 'text-dark' : 'text-muted italic'}`}>
                    {subAnswer?.trim() || 'No answer written'}
                  </div>
                ) : (
                  <textarea
                    rows={3}
                    value={subAnswer ?? ''}
                    onChange={(e) => handleSubChange(i, e.target.value)}
                    readOnly={locked}
                    placeholder={sub.placeholder}
                    className={`${CARD} w-full px-4 sm:px-5 py-3.5 text-sm resize-y outline-none font-sans text-dark
                      ${locked ? 'cursor-not-allowed opacity-60' : 'cursor-text'}`}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}

      {review && q.type === 'fill_blank' && unanswered && (
        <p className="text-xs text-muted italic mt-1">No blanks filled in</p>
      )}
    </div>
  )
})

export default QuestionCard
