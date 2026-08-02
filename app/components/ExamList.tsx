'use client'

import { useQuery } from '@tanstack/react-query'
import ExamCard from '@/app/components/ExamCard'
import ExamsSkeleton from '@/app/components/ExamsSkeleton'
import { examKeys, fetchExamsList } from '@/app/lib/examQueries'
import { useAuth } from '@/app/context/auth-context'

export default function ExamList() {
  const { isLoggedIn: isTeacher, isLoading: authLoading } = useAuth()
  const { data: exams, isPending, isError } = useQuery({ queryKey: examKeys.list(), queryFn: fetchExamsList })

  if (authLoading || isPending) return <ExamsSkeleton />
  if (isError) return <p className="text-sm text-danger">Couldn&apos;t load exams. Please try again.</p>

  if (exams.length === 0) {
    return <p className="text-sm text-muted-dark italic">No exams available yet.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {exams.map((exam) => (
        <ExamCard
          key={exam.id}
          id={exam.id}
          title={exam.title}
          description={exam.description}
          isPublished={exam.isPublished}
          isTeacher={isTeacher}
        />
      ))}
    </div>
  )
}
