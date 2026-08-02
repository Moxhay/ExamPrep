import type { QuestionPayload, WizardQuestion } from '@/app/lib/validation'

type QuestionType = QuestionPayload['type']

const QUESTION_TYPE_META: Record<QuestionType, { label: string; hint: string }> = {
  multiple_choice: { label: 'Multiple choice', hint: 'One correct option' },
  fill_blank: { label: 'Fill in the blank', hint: 'Type the missing word' },
  written: { label: 'Written answer', hint: 'Short free-text response' },
  written_multi: { label: 'Multi-part written', hint: 'Several linked sub-answers' },
}

export function questionTypeLabel(type: QuestionType): string {
  return QUESTION_TYPE_META[type].label
}

export function questionTypeHint(type: QuestionType): string {
  return QUESTION_TYPE_META[type].hint
}

export function countQuestionsByType(questions: WizardQuestion[]): Record<QuestionType, number> {
  return {
    multiple_choice: questions.filter((q) => q.type === 'multiple_choice').length,
    fill_blank: questions.filter((q) => q.type === 'fill_blank').length,
    written: questions.filter((q) => q.type === 'written').length,
    written_multi: questions.filter((q) => q.type === 'written_multi').length,
  }
}
