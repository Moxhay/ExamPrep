import ExamClient from '@/app/components/ExamClient'
import { EXAMS, DEFAULT_EXAM_ID } from '@/app/exams'
import type { Exam } from '@/app/types'

export default async function ExamenPage({
  searchParams,
}: {
  searchParams: Promise<{ exam?: string }>
}) {
  const { exam: examId } = await searchParams
  const examData = (EXAMS.find((e) => e.id === (examId ?? DEFAULT_EXAM_ID))?.data ?? EXAMS[0].data) as Exam
  return <ExamClient key={examData.id} exam={examData} />
}
