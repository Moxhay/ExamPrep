import ExamWizardDetailsStep from '@/app/components/ExamWizardDetailsStep'

export default async function EditExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const examId = Number(id)

  return <ExamWizardDetailsStep examId={examId} />
}
