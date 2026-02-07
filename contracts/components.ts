import type { CreateArticleInput } from '@/features/newsletter/contracts/article'
import type { SupportedLang } from '@/config/i18n'

export interface ArticleFormSingleLangValues {
  slug: string
  author: string
  tags: Array<string>
  title: string
  excerpt: string
  content: string
}

export interface ArticleFormProps {
  lang: SupportedLang
  groupId?: string
  defaultAuthor?: string
  initialValues?: Partial<ArticleFormSingleLangValues>
  onSubmit: (data: CreateArticleInput) => Promise<unknown>
  isSubmitting: boolean
}

export interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  variant?: 'danger' | 'default'
  size?: 'default' | 'wide'
  className?: string
  onConfirm: () => void
  onCancel: () => void
}

export interface ArticleContentProps {
  content: string
  className?: string
}

export interface RichTextEditorProps {
  value: string
  onChange: (value: string | undefined) => void
  placeholder?: string
  minHeight?: number
  id?: string
}

import type { Editor } from '@tiptap/core'

export interface RichTextEditorToolbarProps {
  editor: Editor | null
}
