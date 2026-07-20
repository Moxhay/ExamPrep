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

function IconMenu() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
}

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

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
  onNavigate?: () => void
}

function NavItem({ href, label, icon, active, collapsed, onNavigate }: NavItemProps) {
  const { component, color } = ICON_MAP[icon]
  return (
    <Link
      href={href}
      onClick={onNavigate}
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const [examStarted, setExamStarted] = useState(false)
  const searchParams = useSearchParams()
  const currentId = searchParams.get('exam') ?? DEFAULT_EXAM_ID

  useEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', collapsed)
  }, [collapsed])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    const onOpen  = () => setMobileOpen(true)
    const onStart = () => setExamStarted(true)
    const onReset = () => setExamStarted(false)
    document.addEventListener('open-mobile-sidebar', onOpen)
    document.addEventListener('exam-started', onStart)
    document.addEventListener('exam-reset',   onReset)
    return () => {
      document.removeEventListener('open-mobile-sidebar', onOpen)
      document.removeEventListener('exam-started', onStart)
      document.removeEventListener('exam-reset',   onReset)
    }
  }, [])

  const closeMobile = () => setMobileOpen(false)
  const showLabels = !collapsed || mobileOpen

  return (
    <>
      {/*
        Floating hamburger — mobile/tablet only (lg:hidden).
        Hidden once the exam starts: the sticky nav integrates its own button.
      */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className={`lg:hidden fixed top-3 left-3 z-40 p-2 rounded-lg bg-stone-50 border border-stone-200 shadow-sm text-gray-600 hover:text-gray-900 transition-colors print:hidden ${examStarted ? 'hidden' : ''}`}
      >
        <IconMenu />
      </button>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-40 print:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          print:hidden fixed left-0 top-0 h-full z-50 flex flex-col
          bg-stone-50 border-r border-stone-200
          transition-[width,transform] duration-200 overflow-hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          w-60
          ${collapsed ? 'lg:w-14' : 'lg:w-60'}
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 px-3 min-h-13 border-b border-gray-100">
          <span className="shrink-0 text-gray-900">
            <Logo />
          </span>
          {showLabels && (
            <span className="font-semibold text-gray-900 text-sm tracking-tight">
              ExamPrep
            </span>
          )}
          <button
            onClick={closeMobile}
            aria-label="Close menu"
            className="lg:hidden ml-auto p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <IconX />
          </button>
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
              collapsed={collapsed && !mobileOpen}
              onNavigate={closeMobile}
            />
          ))}
        </nav>

        {/* Footer toggle — desktop only */}
        <div className="hidden lg:block p-2 border-t border-gray-100">
          <NavToggle collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        </div>
      </aside>
    </>
  )
}
