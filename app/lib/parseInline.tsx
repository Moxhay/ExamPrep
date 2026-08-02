import React from 'react'

export function parseInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*_[^ _](?:[^_]*[^_])?_\*\*|\*\*.*?\*\*|_[^ _](?:[^_]*[^ _])?_)/g)
  if (parts.length === 1) return text
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**_') && part.endsWith('_**')) return <strong key={i}><u>{part.slice(3, -3)}</u></strong>
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
        if (part.startsWith('_') && part.endsWith('_')) return <u key={i}>{part.slice(1, -1)}</u>
        return part
      })}
    </>
  )
}
