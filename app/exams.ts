import mockExam1 from '../data/exam1.json'
import mockExam2 from '../data/exam2.json'
import mockExam3 from '../data/exam3.json'
import mockExam4 from '../data/exam4.json'
import mockExam5 from '../data/exam5.json'
import mockExam6 from '../data/exam6.json'
import mockExam7 from '../data/exam7.json'
import mockExam8 from '../data/exam8.json'
import mockExam9 from '../data/exam9.json'
import mockExam10 from '../data/exam10.json'


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
  { id: 'mock-exam-4', title: 'Exam 4', description: '25 MC + 5 written · 50 min', icon: 'clipboard', data: mockExam4 },
  { id: 'mock-exam-5', title: 'Exam 5', description: '25 MC + 5 written · 50 min', icon: 'clipboard', data: mockExam5 },
  { id: 'mock-exam-6', title: 'Exam 6', description: '25 MC + 5 written · 50 min', icon: 'clipboard', data: mockExam6 },
  { id: 'mock-exam-7', title: 'Exam 7', description: '25 MC + 5 written · 50 min', icon: 'clipboard', data: mockExam7 },
  { id: 'mock-exam-8', title: 'Exam 8', description: '25 MC + 5 written · 50 min', icon: 'clipboard', data: mockExam8 },
  { id: 'mock-exam-9', title: 'Exam 9', description: '25 MC + 5 written · 50 min', icon: 'clipboard', data: mockExam9 },
  { id: 'mock-exam-10', title: 'Exam 10', description: '25 MC + 5 written · 50 min', icon: 'clipboard', data: mockExam10 },
]

export const DEFAULT_EXAM_ID = 'mock-exam-1'
