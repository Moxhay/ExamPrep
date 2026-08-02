import LoginForm from '@/app/components/LoginForm'
import GuestOnly from '@/app/components/GuestOnly'
import { IconLogo } from '@/app/components/icons'

export default function LoginPage() {
  return (
    <div className="flex-1 bg-bg flex items-center justify-center px-4 py-12">
      <GuestOnly>
        <div className="w-full max-w-sm bg-surface rounded-2xl p-8 shadow-[0_8px_22px_-14px_rgba(90,60,30,0.3)]">
          <div className="flex flex-col items-center text-center mb-7">
            <span className="w-11 h-11 rounded-lg bg-primary text-white flex items-center justify-center mb-4">
              <IconLogo />
            </span>
            <h1 className="font-display text-xl font-bold text-dark mb-1">Teacher access</h1>
            <p className="text-xs text-muted-dark">Sign in to manage your exams</p>
          </div>
          <LoginForm />
        </div>
      </GuestOnly>
    </div>
  )
}
