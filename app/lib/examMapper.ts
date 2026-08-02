import type { Exam, Question } from '@/app/types'
import type { ExamDetailInternal, InternalQuestionResponse } from '@/app/api'

function toQuestion(q: InternalQuestionResponse): Question {
  return {
    id: String(q.id),
    number: q.number,
    type: q.type,
    text: q.text,
    context: q.context ?? undefined,
    options: q.type === 'multiple_choice' ? q.options.map((o) => ({ id: String(o.id), text: o.text })) : undefined,
    placeholder: q.type === 'written' ? (q.placeholder ?? undefined) : undefined,
    subQuestions:
      q.type === 'written_multi'
        ? q.subQuestions.map((s) => ({ label: s.label, text: s.text ?? undefined, placeholder: s.placeholder ?? '' }))
        : undefined,
  }
}

export function examDetailToExam(exam: ExamDetailInternal): Exam {
  return {
    id: String(exam.id),
    title: exam.title,
    description: exam.description ?? '',
    questions: exam.questions.map(toQuestion),
  }
}
