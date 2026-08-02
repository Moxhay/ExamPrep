'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { LOGIN_PATH } from '@/app/const'
import { useAuth } from '@/app/context/auth-context'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { isLoggedIn, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace(LOGIN_PATH)
    }
  }, [isLoading, isLoggedIn, router])

  if (isLoading || !isLoggedIn) return null

  return <>{children}</>
}
