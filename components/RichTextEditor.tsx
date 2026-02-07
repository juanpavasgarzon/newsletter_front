'use client'

import { useEffect, useRef } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from '@tiptap/markdown'
import StarterKit from '@tiptap/starter-kit'
import type { RichTextEditorProps } from '@/contracts/components'
import { RichTextEditorToolbar } from '@/components/RichTextEditorToolbar'
import { useTheme } from '@/context/theme-context'

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = 320,
  id,
}: RichTextEditorProps) {
  const { theme } = useTheme()
  const isInitialMount = useRef(true)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown.configure({ markedOptions: { gfm: true } }),
      Placeholder.configure({ placeholder: placeholder ?? '' }),
    ],
    content: value || '',
    contentType: 'markdown',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[280px] w-full px-4 py-3 text-primary outline-none [&_pre]:bg-surface-muted [&_pre]:rounded [&_pre]:p-3 [&_code]:bg-surface-muted [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5',
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => {
      const md = e.getMarkdown()
      onChange(md || undefined)
    },
  })

  const lastExternalValue = useRef<string>(value)
  useEffect(() => {
    if (!editor) {
      return
    }
    if (isInitialMount.current) {
      isInitialMount.current = false
      lastExternalValue.current = value
      return
    }
    if (lastExternalValue.current === value) {
      return
    }
    lastExternalValue.current = value
    const current = editor.getMarkdown()
    if (value !== current) {
      editor.commands.setContent(value || '', { contentType: 'markdown' })
    }
  }, [value, editor])

  if (!editor) {
    return null
  }

  return (
    <div
      data-color-mode={theme}
      className="border-theme overflow-hidden rounded-lg border bg-surface"
    >
      <RichTextEditorToolbar editor={editor} />
      <EditorContent
        editor={editor}
        id={id}
        className="tiptap-editor-wrap"
        style={{ minHeight }}
      />
    </div>
  )
}
