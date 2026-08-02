import type { JSONContent } from '@tiptap/react'

const INLINE_TOKEN = /(\*\*_[^ _](?:[^_]*[^_])?_\*\*|\*\*.*?\*\*|_[^ _](?:[^_]*[^ _])?_)/g

function serializeParagraph(paragraph: JSONContent): string {
  return (paragraph.content ?? [])
    .map((node) => {
      if (node.type === 'hardBreak') return '\n'
      if (node.type !== 'text') return ''

      const text = node.text ?? ''
      const markTypes = new Set((node.marks ?? []).map((mark) => mark.type))
      const bold = markTypes.has('bold')
      const underline = markTypes.has('underline')

      if (bold && underline) return `**_${text}_**`
      if (bold) return `**${text}**`
      if (underline) return `_${text}_`
      return text
    })
    .join('')
}

export function serializeToStoredText(json: JSONContent): string {
  return (json.content ?? []).map(serializeParagraph).join('\n\n')
}

function parseLineToTextNodes(line: string): JSONContent[] {
  const parts = line.split(INLINE_TOKEN).filter((part) => part.length > 0)
  if (parts.length === 0) return []

  return parts.map((part): JSONContent => {
    if (part.startsWith('**_') && part.endsWith('_**')) {
      return { type: 'text', text: part.slice(3, -3), marks: [{ type: 'bold' }, { type: 'underline' }] }
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return { type: 'text', text: part.slice(2, -2), marks: [{ type: 'bold' }] }
    }
    if (part.startsWith('_') && part.endsWith('_')) {
      return { type: 'text', text: part.slice(1, -1), marks: [{ type: 'underline' }] }
    }
    return { type: 'text', text: part }
  })
}

function deserializeParagraph(paragraph: string): JSONContent {
  const lines = paragraph.split('\n')
  const content: JSONContent[] = []

  lines.forEach((line, i) => {
    if (i > 0) content.push({ type: 'hardBreak' })
    content.push(...parseLineToTextNodes(line))
  })

  return content.length > 0 ? { type: 'paragraph', content } : { type: 'paragraph' }
}

export function deserializeToTiptapContent(stored: string): JSONContent {
  if (!stored) return { type: 'doc', content: [{ type: 'paragraph' }] }

  return {
    type: 'doc',
    content: stored.split('\n\n').map(deserializeParagraph),
  }
}
