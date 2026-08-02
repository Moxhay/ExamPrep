import ExamList from '@/app/components/ExamList'
import CreateExamButton from '@/app/components/CreateExamButton'

export default function Home() {
  return (
    <div className="flex-1 bg-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-dark mb-1.5">Hello 👋</h1>
            <p className="text-sm text-muted-dark">Choose an exam to get started</p>
          </div>
          <CreateExamButton />
        </div>
        <ExamList />
      </div>
    </div>
  )
}
