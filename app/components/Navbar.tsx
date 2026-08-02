import Link from 'next/link'
import { HOME_PATH } from '@/app/const'
import { IconLogo } from '@/app/components/icons'
import AuthButton from '@/app/components/AuthButton'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 h-16 print:hidden bg-bg">
      <div className="h-full max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6">
        <Link href={HOME_PATH} className="flex items-center gap-2.5">
          <span className="w-7.5 h-7.5 rounded-lg bg-primary text-white shrink-0 flex items-center justify-center">
            <IconLogo />
          </span>
          <span className="font-display font-bold text-dark text-base tracking-tight">
            ExamPrep
          </span>
        </Link>
        <AuthButton />
      </div>
    </header>
  )
}
