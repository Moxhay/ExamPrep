import React from 'react'

// _text_ → <u>  **text** → <strong>
export function parseInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|_[^_]+_)/g)
  if (parts.length === 1) return text
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
        if (part.startsWith('_') && part.endsWith('_')) return <u key={i}>{part.slice(1, -1)}</u>
        return part
      })}
    </>
  )
}
