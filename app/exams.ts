import mockExam1 from '../data/exam1.json'
import mockExam2 from '../data/exam2.json'
import mockExam3 from '../data/exam3.json'


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
  { id: 'mock-exam-2', title: 'Exam 2', description: '25 MC + 6 written · 50 min', icon: 'clipboard', data: mockExam2 },
  { id: 'mock-exam-3', title: 'Exam 3', description: '25 MC + 5 written · 50 min', icon: 'clipboard', data: mockExam3 },
]

export const DEFAULT_EXAM_ID = 'mock-exam-1'
