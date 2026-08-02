import type { ReactNode } from 'react'
import RequireAuth from '@/app/components/RequireAuth'
import CreateExamHeader from '@/app/components/CreateExamHeader'
import { EDIT_EXAM_PATH } from '@/app/const'

export default async function EditExamLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const examId = Number(id)
  const basePath = `${EDIT_EXAM_PATH}/${examId}`

  return (
    <RequireAuth>
      <div className="flex-1 bg-bg">
        <CreateExamHeader basePath={basePath} title="Edit exam" examId={examId} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">{children}</div>
      </div>
    </RequireAuth>
  )
}