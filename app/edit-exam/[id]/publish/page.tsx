import ExamWizardPublishStep from '@/app/components/ExamWizardPublishStep'

export default async function EditExamPublishPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const examId = Number(id)

  return <ExamWizardPublishStep examId={examId} />
}
