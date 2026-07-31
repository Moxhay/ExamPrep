import Link from 'next/link'
import { EXAM_PATH } from '@/app/const'

export interface ExamCardProps {
  id: string
  title: string
  description: string
}

export default function ExamCard({ id, title, description }: ExamCardProps) {
  return (
    <div className="bg-surface rounded-2xl p-5 shadow-[0_8px_22px_-14px_rgba(90,60,30,0.3)]">
      <div className="font-display font-bold text-base text-dark mb-3.5">{title}</div>
      <div className="text-xs text-muted mb-4">{description}</div>
      <Link
        href={`${EXAM_PATH}?exam=${id}`}
        className="block text-center bg-primary text-white py-2.5 rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors"
      >
        Start
      </Link>
    </div>
  )
}
