'use client'

import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { RichTextEditorToolbarProps } from '@/contracts/components'

export function RichTextEditorToolbar({ editor: ed }: RichTextEditorToolbarProps) {
  const { t } = useTranslation()
  if (!ed) {
    return null
  }
  return (
    <div className="border-theme flex flex-wrap items-center gap-0.5 border-b bg-surface-muted p-1">
      <button
        type="button"
        onClick={() => ed.chain().focus().toggleBold().run()}
        className={`rounded p-2 transition-colors ${
          ed.isActive('bold')
            ? 'bg-accent text-white'
            : 'text-surface-muted hover:bg-surface hover:text-primary'
        }`}
        title={t('form.bold')}
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => ed.chain().focus().toggleItalic().run()}
        className={`rounded p-2 transition-colors ${
          ed.isActive('italic')
            ? 'bg-accent text-white'
            : 'text-surface-muted hover:bg-surface hover:text-primary'
        }`}
        title={t('form.italic')}
      >
        <Italic className="h-4 w-4" />
      </button>
      <span className="text-border-theme mx-0.5 w-px self-stretch bg-[var(--color-border)]" />
      <button
        type="button"
        onClick={() => ed.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`rounded p-2 transition-colors ${
          ed.isActive('heading', { level: 1 })
            ? 'bg-accent text-white'
            : 'text-surface-muted hover:bg-surface hover:text-primary'
        }`}
        title={t('form.heading1')}
      >
        <Heading1 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => ed.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`rounded p-2 transition-colors ${
          ed.isActive('heading', { level: 2 })
            ? 'bg-accent text-white'
            : 'text-surface-muted hover:bg-surface hover:text-primary'
        }`}
        title={t('form.heading2')}
      >
        <Heading2 className="h-4 w-4" />
      </button>
      <span className="text-border-theme mx-0.5 w-px self-stretch bg-[var(--color-border)]" />
      <button
        type="button"
        onClick={() => ed.chain().focus().toggleBulletList().run()}
        className={`rounded p-2 transition-colors ${
          ed.isActive('bulletList')
            ? 'bg-accent text-white'
            : 'text-surface-muted hover:bg-surface hover:text-primary'
        }`}
        title={t('form.bulletList')}
      >
        <List className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => ed.chain().focus().toggleOrderedList().run()}
        className={`rounded p-2 transition-colors ${
          ed.isActive('orderedList')
            ? 'bg-accent text-white'
            : 'text-surface-muted hover:bg-surface hover:text-primary'
        }`}
        title={t('form.orderedList')}
      >
        <ListOrdered className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => ed.chain().focus().toggleBlockquote().run()}
        className={`rounded p-2 transition-colors ${
          ed.isActive('blockquote')
            ? 'bg-accent text-white'
            : 'text-surface-muted hover:bg-surface hover:text-primary'
        }`}
        title={t('form.quote')}
      >
        <Quote className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => ed.chain().focus().toggleCodeBlock().run()}
        className={`rounded p-2 transition-colors ${
          ed.isActive('codeBlock')
            ? 'bg-accent text-white'
            : 'text-surface-muted hover:bg-surface hover:text-primary'
        }`}
        title={t('form.codeBlock')}
      >
        <Code className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => ed.chain().focus().setHorizontalRule().run()}
        className="rounded p-2 text-surface-muted transition-colors hover:bg-surface hover:text-primary"
        title={t('form.horizontalRule')}
      >
        <Minus className="h-4 w-4" />
      </button>
    </div>
  )
}
