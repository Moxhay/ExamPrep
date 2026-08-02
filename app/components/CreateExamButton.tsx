'use client'

import Link from 'next/link'
import { CREATE_EXAM_PATH } from '@/app/const'
import { useAuth } from '@/app/context/auth-context'

export default function CreateExamButton() {
  const { isLoggedIn, isLoading } = useAuth()

  if (isLoading || !isLoggedIn) return null

  return (
    <Link
      href={CREATE_EXAM_PATH}
      className="bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-primary-hover transition-colors"
    >
      + Create exam
    </Link>
  )
}
