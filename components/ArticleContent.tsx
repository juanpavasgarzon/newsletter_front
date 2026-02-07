'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ArticleContentProps } from '@/contracts/components'

export function ArticleContent({
  content,
  className = '',
}: ArticleContentProps) {
  return (
    <div
      className={`article-content prose prose-lg max-w-none break-words ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
