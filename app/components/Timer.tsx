'use client'

import { useState, useRef, useEffect, memo } from 'react'
import { EXAM_DURATION_MINUTES } from '../const'

export interface TimerProps {
  onTimeUp: () => void
}

const Timer = memo(function Timer({ onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_MINUTES * 60)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeUp = timeLeft <= 0

  useEffect(() => {
    if (timeUp) return
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(intervalRef.current!); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current!)
  }, [timeUp])

  useEffect(() => {
    if (timeLeft === 0) onTimeUp()
  }, [timeLeft, onTimeUp])

  const m = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const s = (timeLeft % 60).toString().padStart(2, '0')
  const cls = timeUp
    ? 'text-red-600 bg-red-50 border-red-300'
    : timeLeft <= 300
    ? 'text-amber-600 bg-amber-50 border-amber-300'
    : 'text-gray-900 bg-gray-100 border-gray-200'

  return (
    <span className={`text-sm font-bold tabular-nums px-3 py-1 rounded-lg border ${cls}`}>
      {timeUp ? "Time's up" : `${m}:${s}`}
    </span>
  )
})

export default Timer
