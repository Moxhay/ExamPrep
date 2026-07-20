import type { DialogStat } from '../types'

export interface DialogAction {
  label: string
  onClick: () => void
  icon?: React.ReactNode
  className?: string
}

export interface ExamDialogProps {
  title: string
  description: string
  stats: DialogStat[]
  note?: React.ReactNode
  action: DialogAction
  secondaryActions?: DialogAction[]
}

export default function ExamDialog({ title, description, stats, note, action, secondaryActions }: ExamDialogProps) {
  return (
    <>
      <div className="fixed inset-0 bg-stone-900/25 z-30 print:hidden" />
      <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 z-30 print:hidden">
        <div className="bg-stone-50 backdrop-blur-2xl rounded-2xl p-6 sm:p-10 max-w-md w-full shadow-2xl border border-stone-200/70">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-stone-500 mb-5 sm:mb-7 leading-relaxed text-sm sm:text-base">{description}</p>

          <div className="flex gap-6 sm:gap-8 mb-4 sm:mb-5">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-xs text-stone-400">{s.label}</div>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              </div>
            ))}
          </div>

          {note && <p className="text-xs text-stone-400 mb-5 sm:mb-8">{note}</p>}

          <button
            onClick={action.onClick}
            className={action.className ?? 'w-full bg-gray-900 text-white py-3.5 rounded-xl text-base font-semibold tracking-wide cursor-pointer hover:bg-gray-700 transition-colors'}
          >
            {action.label}
          </button>

          {secondaryActions && secondaryActions.length > 0 && (
            <div className="flex gap-2 mt-3">
              {secondaryActions.map((a) => (
                <button
                  key={a.label}
                  onClick={a.onClick}
                  className={a.className ?? 'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:text-stone-900 bg-stone-200 hover:bg-stone-300 cursor-pointer transition-colors'}
                >
                  {a.icon}
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
