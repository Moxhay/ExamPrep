import type { WizardQuestion } from '@/app/lib/validation'
import type { InternalQuestionResponse } from '@/app/api'

export function questionResponseToWizard(q: InternalQuestionResponse): WizardQuestion {
  const base = { id: q.id, number: q.number, title: q.title ?? q.text, text: q.text, context: q.context ?? undefined }

  switch (q.type) {
    case 'multiple_choice':
      return { ...base, type: 'multiple_choice', options: q.options.map((o) => ({ text: o.text })) }
    case 'fill_blank':
      return { ...base, type: 'fill_blank' }
    case 'written':
      return { ...base, type: 'written', placeholder: q.placeholder ?? undefined }
    case 'written_multi':
      return {
        ...base,
        type: 'written_multi',
        subQuestions: q.subQuestions.map((s) => ({ label: s.label, text: s.text ?? undefined, placeholder: s.placeholder ?? undefined })),
      }
  }
}
