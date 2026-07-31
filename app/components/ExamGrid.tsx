import ExamCard from '@/app/components/ExamCard'
import { EXAMS } from '@/app/exams'
export default async function ExamGrid() {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {EXAMS.map((exam) => (
        <ExamCard key={exam.id} id={exam.id} title={exam.title} description={exam.description} />
      ))}
    </div>
  )
}
