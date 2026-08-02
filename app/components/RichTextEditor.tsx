'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { deserializeToTiptapContent, serializeToStoredText } from '@/app/lib/richText'

export interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  compact?: boolean
}

const TOOLBAR_GLYPH = 'w-6 h-6 rounded-md text-xs font-bold transition-colors flex items-center justify-center'
const TOOLBAR_BUTTON = 'px-2.5 h-6 rounded-md text-[11px] font-semibold tracking-wide transition-colors flex items-center gap-1'
const TOOLBAR_BUTTON_INACTIVE = 'text-muted-dark hover:text-dark hover:bg-bg'
const TOOLBAR_BUTTON_ACTIVE = 'bg-selected-bg text-primary'

export default function RichTextEditor({ value, onChange, placeholder, compact = false }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        listKeymap: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
        italic: false,
        strike: false,
        link: false,
        dropcursor: false,
        gapcursor: false,
        trailingNode: false,
      }),
    ],
    content: deserializeToTiptapContent(value),
    editorProps: {
      attributes: {
        class: `outline-none text-sm text-dark whitespace-pre-wrap ${compact ? 'min-h-6' : 'min-h-16'}`,
      },
    },
    onUpdate: ({ editor }) => onChange(serializeToStoredText(editor.getJSON())),
  })

  if (!editor) return null

  const boldActive = editor.isActive('bold')
  const underlineActive = editor.isActive('underline')

  return (
    <div className="bg-bg rounded-lg px-3.5 py-2.5 shadow-[inset_0_1px_3px_rgba(90,60,30,0.12)]">
      <div className="flex items-center gap-1 mb-2 border-b border-border pb-2">
        <button
          type="button"
          aria-label="Bold"
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${TOOLBAR_GLYPH} ${boldActive ? TOOLBAR_BUTTON_ACTIVE : TOOLBAR_BUTTON_INACTIVE}`}
        >
          B
        </button>
        <button
          type="button"
          aria-label="Underline"
          title="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`${TOOLBAR_GLYPH} underline underline-offset-2 ${underlineActive ? TOOLBAR_BUTTON_ACTIVE : TOOLBAR_BUTTON_INACTIVE}`}
        >
          U
        </button>
        <span className="w-px h-4 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().insertContent('__________').run()}
          className={`${TOOLBAR_BUTTON} ${TOOLBAR_BUTTON_INACTIVE}`}
        >
          + Gap
        </button>
      </div>
      <div className="relative">
        {editor.isEmpty && placeholder && (
          <span className="absolute inset-0 text-sm text-muted pointer-events-none">{placeholder}</span>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
