import mockExam1 from '../data/exam1.json'


export type ExamIcon = 'clipboard' | 'book'

export type ExamEntry = {
  id: string
  title: string
  description: string
  icon: ExamIcon
  data: object
}

export const EXAMS: ExamEntry[] = [
  { id: 'mock-exam-1', title: 'Exam 1', description: '25 MC + 6 written · 50 min', icon: 'clipboard', data: mockExam1 },
]

export const DEFAULT_EXAM_ID = 'mock-exam-1'
