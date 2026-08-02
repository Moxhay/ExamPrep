'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CREATE_EXAM_PATH } from '@/app/const'

export interface CreateExamHeaderProps {
  basePath?: string
  title?: string
  examId: number | null
}

export default function CreateExamHeader({ basePath = CREATE_EXAM_PATH, title = 'Create exam', examId }: CreateExamHeaderProps) {
  const pathname = usePathname()

  const steps = [
    { path: basePath, label: 'Details' },
    { path: `${basePath}/questions`, label: 'Questions' },
    { path: `${basePath}/publish`, label: 'Publish' },
  ]

  return (
    <div className="sticky top-16 z-10 bg-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <h1 className="font-display text-xl font-bold text-dark mb-4">{title}</h1>
        <div className="flex items-center gap-2">
          {steps.map(({ path, label }, index) => {
            const active = pathname === path
            const reachable = index === 0 || Boolean(examId)

            const className = `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors
              ${active ? 'bg-surface text-dark shadow-[0_4px_14px_-8px_rgba(90,60,30,0.25)]' : 'text-muted-dark'}
              ${reachable ? 'hover:text-dark' : 'cursor-not-allowed opacity-60'}`

            const content = (
              <>
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0
                    ${reachable ? 'bg-primary text-white' : 'bg-border text-muted-dark'}`}
                >
                  {index + 1}
                </span>
                {label}
              </>
            )

            return reachable ? (
              <Link key={path} href={path} className={className}>
                {content}
              </Link>
            ) : (
              <span key={path} className={className}>
                {content}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
