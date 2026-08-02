import { apiExams, type ExamDetailInternal } from '@/app/api'
import type { ExamSummary, WizardQuestion } from '@/app/lib/validation'
import { questionResponseToWizard } from '@/app/lib/questionMapper'

export const examKeys = {
  list: () => ['exams'] as const,
  detail: (examId: number) => ['exam', examId] as const,
}

export async function fetchExamsList(): Promise<ExamSummary[]> {
  const res = await apiExams.getAll({ cache: false })
  if (!res.success || !res.data) throw new Error(res.error ?? "Couldn't load exams.")
  return res.data
}

export async function fetchExamDetail(examId: number): Promise<ExamDetailInternal> {
  const res = await apiExams.getById(examId, { cache: false })
  if (!res.success || !res.data) throw new Error(res.error ?? "Couldn't load the exam.")
  return res.data
}

export interface ExamDraftView {
  title: string
  description: string
  isPublished: boolean
  questions: WizardQuestion[]
}

export function toDraftView(exam: ExamDetailInternal): ExamDraftView {
  return {
    title: exam.title,
    description: exam.description ?? '',
    isPublished: exam.isPublished,
    questions: exam.questions.map(questionResponseToWizard),
  }
}
