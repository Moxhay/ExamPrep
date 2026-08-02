'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { HOME_PATH } from '@/app/const'
import { useAuth } from '@/app/context/auth-context'

export default function GuestOnly({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { isLoggedIn, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.replace(HOME_PATH)
    }
  }, [isLoading, isLoggedIn, router])

  if (isLoading || isLoggedIn) return null

  return <>{children}</>
}