'use client'

import { useRouter } from 'next/navigation'
import type { SubmitEvent } from 'react'
import { HOME_PATH } from '@/app/const'
import { useAuth } from '@/app/context/auth-context'

export default function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    await login({ email, password })
    router.push(HOME_PATH)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-semibold text-muted-dark">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@school.edu"
          className="bg-bg rounded-lg px-3.5 py-2.5 text-sm text-dark  outline-none shadow-[inset_0_1px_3px_rgba(90,60,30,0.12)] focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-xs font-semibold text-muted-dark">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="bg-bg rounded-lg px-3.5 py-2.5 text-sm text-dark outline-none shadow-[inset_0_1px_3px_rgba(90,60,30,0.12)] focus:ring-2 focus:ring-primary"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors disabled:opacity-60"
      >
        Sign in
      </button>
    </form>
  )
}