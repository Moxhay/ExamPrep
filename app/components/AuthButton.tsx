'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HOME_PATH, LOGIN_PATH } from '@/app/const'
import { useAuth } from '@/app/context/auth-context'

export default function AuthButton() {
  const router = useRouter()
  const { isLoggedIn, isLoading, logout } = useAuth()

  async function handleLogout() {
    await logout()
    router.push(HOME_PATH)
    router.refresh()
  }

  if (isLoading) {
    return <div className="w-28 h-9 rounded-lg bg-border animate-pulse" />
  }

  if (isLoggedIn) {
    return (
      <button
        type="button"
        onClick={handleLogout}
        className="bg-dark text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-dark/90 transition-colors"
      >
        Logout
      </button>
    )
  }

  return (
    <Link
      href={LOGIN_PATH}
      className="bg-dark text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-dark/90 transition-colors"
    >
      Teacher access →
    </Link>
  )
}