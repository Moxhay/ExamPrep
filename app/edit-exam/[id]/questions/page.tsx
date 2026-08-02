import ExamWizardQuestionsStep from '@/app/components/ExamWizardQuestionsStep'

export default async function EditExamQuestionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const examId = Number(id)

  return <ExamWizardQuestionsStep examId={examId} />
}
