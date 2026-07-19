'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { EXAMS, DEFAULT_EXAM_ID, type ExamIcon } from '../exams'
import { EXAM_PATH } from '../const'

// ─── Logo ────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 3 1 9l11 6 9-4.91V17h2V9z"/>
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17z"/>
    </svg>
  )
}

// ─── Exam icons ───────────────────────────────────────────────────────────────

function IconClipboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <rect width="8" height="4" x="8" y="2" rx="1"/>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <path d="m9 14 2 2 4-4"/>
    </svg>
  )
}

function IconBookOpen() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 0 3-3h7z"/>
    </svg>
  )
}

const ICON_MAP: Record<ExamIcon, { component: React.ReactNode; color: string }> = {
  clipboard: { component: <IconClipboard />, color: 'text-sky-600'    },
  book:      { component: <IconBookOpen />,  color: 'text-violet-600' },
}

// ─── Toggle icons ─────────────────────────────────────────────────────────────

function IconChevronsLeft() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <polyline points="11 17 6 12 11 7"/>
      <polyline points="18 17 13 12 18 7"/>
    </svg>
  )
}

function IconChevronsRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <polyline points="13 17 18 12 13 7"/>
      <polyline points="6 17 11 12 6 7"/>
    </svg>
  )
}

// ─── NavItem ─────────────────────────────────────────────────────────────────

type NavItemProps = {
  href: string
  label: string
  icon: ExamIcon
  active: boolean
  collapsed: boolean
}

function NavItem({ href, label, icon, active, collapsed }: NavItemProps) {
  const { component, color } = ICON_MAP[icon]
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={`flex items-center gap-3 px-2.5 py-2.5 rounded-lg transition-colors text-sm whitespace-nowrap ${
        active
          ? 'bg-gray-900 text-white font-medium'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <span className={active ? 'text-white' : color}>
        {component}
      </span>
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  )
}

// ─── NavToggle ───────────────────────────────────────────────────────────────

type NavToggleProps = {
  collapsed: boolean
  onToggle: () => void
}

function NavToggle({ collapsed, onToggle }: NavToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer text-sm"
    >
      {collapsed ? <IconChevronsRight /> : <IconChevronsLeft />}
      {!collapsed && <span className="font-medium">Collapse</span>}
    </button>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const searchParams = useSearchParams()
  const currentId = searchParams.get('exam') ?? DEFAULT_EXAM_ID

  useEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', collapsed)
  }, [collapsed])

  return (
    <aside
      className={`print:hidden fixed left-0 top-0 h-full z-40 flex flex-col bg-stone-50 border-r border-stone-200 transition-[width] duration-200 overflow-hidden ${
        collapsed ? 'w-14' : 'w-60'
      }`}
    >
      {/* Header / Logo */}
      <div className="flex items-center gap-2.5 px-3 min-h-13 border-b border-gray-100">
        <span className="shrink-0 text-gray-900">
          <Logo />
        </span>
        {!collapsed && (
          <span className="font-semibold text-gray-900 text-sm tracking-tight">
            ExamPrep
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-0.5 p-2 overflow-y-auto">
        {EXAMS.map((exam) => (
          <NavItem
            key={exam.id}
            href={`${EXAM_PATH}?exam=${exam.id}`}
            label={exam.title}
            icon={exam.icon}
            active={currentId === exam.id}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Footer toggle */}
      <div className="p-2 border-t border-gray-100">
        <NavToggle collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      </div>
    </aside>
  )
}
