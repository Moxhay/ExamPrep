'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { apiAuth, type LoginPayload } from '@/app/api'
import { examKeys } from '@/app/lib/examQueries'

interface AuthContextValue {
  isLoggedIn: boolean
  isLoading: boolean
  login: (credentials: LoginPayload) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const queryClient = useQueryClient()

  useEffect(() => {
    apiAuth
      .me()
      .then((res) => setIsLoggedIn(res.success))
      .finally(() => setIsLoading(false))
  }, [])

  async function login(credentials: LoginPayload) {
    const res = await apiAuth.login(credentials)
    if (!res.success) throw new Error(res.error ?? 'Login failed')
    setIsLoggedIn(true)
    queryClient.invalidateQueries({ queryKey: examKeys.list() })
  }

  async function logout() {
    await apiAuth.logout()
    setIsLoggedIn(false)
    queryClient.invalidateQueries({ queryKey: examKeys.list() })
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
