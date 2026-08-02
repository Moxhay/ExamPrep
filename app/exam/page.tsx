import { notFound } from 'next/navigation'
import ExamClient from '@/app/components/ExamClient'

export default async function ExamenPage({
  searchParams,
}: {
  searchParams: Promise<{ exam?: string }>
}) {
  const { exam: examIdParam } = await searchParams
  const examId = Number(examIdParam)

  if (!examIdParam || Number.isNaN(examId)) notFound()

  return <ExamClient key={examId} examId={examId} />
}
