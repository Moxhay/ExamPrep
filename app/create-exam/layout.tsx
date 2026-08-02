import type { ReactNode } from 'react'
import RequireAuth from '@/app/components/RequireAuth'
import CreateExamHeader from '@/app/components/CreateExamHeader'

export default function CreateExamLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <div className="flex-1 bg-bg">
        <CreateExamHeader examId={null} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">{children}</div>
      </div>
    </RequireAuth>
  )
}
