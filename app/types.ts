export interface Option {
  id: string
  text: string
}

export interface SubQuestion {
  label: string
  placeholder: string
}

export interface Question {
  id: string
  number: number
  type: 'multiple_choice' | 'written' | 'fill_blank' | 'written_multi'
  text: string
  context?: string
  options?: Option[]
  placeholder?: string
  subQuestions?: SubQuestion[]
}

export interface Exam {
  id: string
  title: string
  description: string
  questions: Question[]
}

export interface DialogStat {
  label: string
  value: string | number
}
