'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ArticleFormProps } from '@/contracts/components'
import { RichTextEditor } from '@/components/RichTextEditor'

export function ArticleForm({
  lang,
  groupId,
  defaultAuthor = '',
  initialValues,
  onSubmit,
  isSubmitting,
}: ArticleFormProps) {
  const { t } = useTranslation()
  const [slug, setSlug] = useState(initialValues?.slug ?? '')
  const [author, setAuthor] = useState(initialValues?.author ?? defaultAuthor)
  const [tagsInput, setTagsInput] = useState<string>(() => {
    const raw = initialValues?.tags
    return Array.isArray(raw) ? raw.join(', ') : ''
  })
  const tags = tagsInput
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [excerpt, setExcerpt] = useState(initialValues?.excerpt ?? '')
  const [content, setContent] = useState(initialValues?.content ?? '')

  const filled =
    title.trim() && excerpt.trim() && content.trim() && author.trim()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!filled) {
      return
    }
    await onSubmit({
      lang,
      ...(groupId ? { groupId } : {}),
      slug: slug.trim() || undefined,
      author: author.trim(),
      tags,
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <label className="text-primary block text-sm font-medium">
        {t('form.slugLabel')}
      </label>
      <input
        type="text"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="border-theme bg-surface text-primary placeholder-theme w-full rounded-lg border px-4 py-2.5 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        placeholder={t('form.slugPlaceholder')}
      />
      <label className="text-primary block text-sm font-medium">
        {t('form.author')}
      </label>
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
        className="border-theme bg-surface text-primary placeholder-theme w-full rounded-lg border px-4 py-2.5 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        placeholder={t('form.authorPlaceholder')}
      />
      <label className="text-primary block text-sm font-medium">
        {t('form.tags')}
      </label>
      <input
        type="text"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        className="border-theme bg-surface text-primary placeholder-theme w-full rounded-lg border px-4 py-2.5 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        placeholder={t('form.tagsPlaceholder')}
      />
      {tags.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-accent-muted text-accent rounded-full px-2.5 py-0.5 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <label className="text-primary block text-sm font-medium">
        {t('form.title')}
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="border-theme bg-surface text-primary placeholder-theme w-full rounded-lg border px-4 py-2.5 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        placeholder={t('form.titlePlaceholder')}
      />
      <label className="text-primary block text-sm font-medium">
        {t('form.excerpt')}
      </label>
      <textarea
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        required
        rows={2}
        className="border-theme bg-surface text-primary placeholder-theme w-full resize-y rounded-lg border px-4 py-2.5 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        placeholder={t('form.excerptPlaceholder')}
      />
      <label className="text-primary block text-sm font-medium">
        {t('form.content')}
      </label>
      <RichTextEditor
        value={content}
        onChange={(v) => setContent(v ?? '')}
        placeholder={t('form.contentPlaceholder')}
        minHeight={340}
      />
      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="submit"
          disabled={!filled || isSubmitting}
          className="bg-accent hover:bg-accent-hover text-white rounded-lg px-6 py-2.5 font-medium transition-colors disabled:opacity-50"
        >
          {isSubmitting ? t('common.saving') : t('common.save')}
        </button>
      </div>
    </form>
  )
}
