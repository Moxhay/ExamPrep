'use client'

import { useState, useRef, useEffect, memo } from 'react'
import { CIRCLED } from '../const'
import type { Question } from '../types'
import { parseInline } from '../lib/parseInline'

export interface QuestionCardProps {
  q: Question
  review: boolean
  locked: boolean
  onAnsweredChange: (qId: string, answered: boolean) => void
}

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
                <span className={`inline-block min-w-22.5 border-b-2 border-gray-900 px-1.5 mx-0.5 text-center ${
                  blankAnswer[i]?.trim() ? 'text-gray-900 font-semibold' : 'text-gray-400 italic'
                }`}>
                  {blankAnswer[i] || '___'}
                </span>
              ) : (
                <input
                  key={i}
                  type="text"
                  value={blankAnswer[i] ?? ''}
                  onChange={(e) => handleBlankChange(i, e.target.value)}
                  readOnly={locked}
                  className={`inline-block w-28 border-0 border-b-2 border-gray-900 text-sm text-gray-900 text-center outline-none px-1 mx-0.5 font-sans ${
                    locked ? 'bg-gray-200 cursor-not-allowed' : 'bg-transparent cursor-text'
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
    <div className="mb-10 pb-10 border-b border-gray-100">
      <div className={`text-base font-semibold text-gray-900 whitespace-pre-wrap ${q.context ? 'mb-2' : 'mb-4'}`}>
        <span className="mr-1">{q.number})</span>
        {parseInline(q.text)}
      </div>

      {q.context && (
        <div className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-700 mb-4 leading-relaxed whitespace-pre-wrap">
          {q.type === 'fill_blank' ? renderInlineBlanks(q.context) : parseInline(q.context)}
        </div>
      )}

      {q.type === 'multiple_choice' && q.options && (
        <div className={`flex flex-col ${review ? 'gap-1.5' : 'gap-2'}`}>
          {q.options.map((opt, idx) => {
            const selected = answer === opt.id
            return review ? (
              <div
                key={opt.id}
                className={`flex items-start gap-2.5 px-3 py-2 rounded-lg border-2 text-sm text-gray-900
                  ${selected ? 'border-gray-900 bg-gray-200' : 'border-gray-300 bg-gray-100'}`}
              >
                <strong className="min-w-5">{CIRCLED[idx]}</strong>
                {parseInline(opt.text)}
                {selected && <span className="ml-auto text-xs font-semibold">← your answer</span>}
              </div>
            ) : (
              <label
                key={opt.id}
                className={`flex items-start gap-3 px-3.5 py-2.5 rounded-lg border-2 transition-colors
                  ${selected ? 'border-gray-900 bg-gray-200' : 'border-gray-300 bg-gray-100'}
                  ${locked ? 'cursor-not-allowed' : 'cursor-pointer'}
                  ${locked && !selected ? 'opacity-50' : ''}`}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={opt.id}
                  checked={selected}
                  onChange={() => !locked && setAnswer(opt.id)}
                  className="mt-0.5 accent-gray-900"
                />
                <span className="text-sm text-gray-900">
                  <strong className="mr-1.5">{CIRCLED[idx]}</strong>
                  {parseInline(opt.text)}
                </span>
              </label>
            )
          })}
          {review && unanswered && (
            <p className="text-xs text-gray-400 italic mt-1">No answer selected</p>
          )}
        </div>
      )}

      {q.type === 'written' && (
        review ? (
          <div className={`px-3.5 py-3 rounded-lg border-2 text-sm min-h-12 whitespace-pre-wrap
            ${unanswered ? 'border-gray-200 bg-gray-50 text-gray-400 italic' : 'border-gray-900 bg-gray-100 text-gray-900'}`}>
            {unanswered ? 'No answer written' : answer}
          </div>
        ) : (
          <textarea
            rows={4}
            value={answer}
            onChange={(e) => !locked && setAnswer(e.target.value)}
            readOnly={locked}
            placeholder={q.placeholder ?? 'Write your answer here...'}
            className={`w-full px-3.5 py-3 rounded-lg border-2 border-gray-300 text-sm resize-y outline-none font-sans text-gray-900
              ${locked ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 cursor-text'}`}
          />
        )
      )}

      {q.type === 'written_multi' && (
        <div className="flex flex-col gap-3">
          {(q.subQuestions ?? []).map((sub, i) => {
            const subAnswer = subAnswers[i]
            return (
              <div key={i}>
                <p className="text-xs font-semibold text-gray-500 mb-1">{sub.label}</p>
                {review ? (
                  <div className={`px-3.5 py-2.5 rounded-lg border-2 text-sm whitespace-pre-wrap
                    ${subAnswer?.trim() ? 'border-gray-900 bg-gray-100 text-gray-900' : 'border-gray-200 bg-gray-50 text-gray-400 italic'}`}>
                    {subAnswer?.trim() || 'No answer written'}
                  </div>
                ) : (
                  <textarea
                    rows={3}
                    value={subAnswer ?? ''}
                    onChange={(e) => handleSubChange(i, e.target.value)}
                    readOnly={locked}
                    placeholder={sub.placeholder}
                    className={`w-full px-3.5 py-3 rounded-lg border-2 border-gray-300 text-sm resize-y outline-none font-sans text-gray-900
                      ${locked ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 cursor-text'}`}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}

      {review && q.type === 'fill_blank' && unanswered && (
        <p className="text-xs text-gray-400 italic mt-1">No blanks filled in</p>
      )}
    </div>
  )
})

export default QuestionCard
