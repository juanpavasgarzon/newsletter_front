import type { SupportedLang } from '@/config/i18n'

export interface Article {
  id: string
  groupId: string
  slug: string
  author: string
  publishedAt: string
  updatedAt: string
  tags: Array<string>
  lang: SupportedLang
  title: string
  excerpt: string
  content: string
}

export interface CreateArticleInput {
  lang: SupportedLang
  groupId?: string
  slug?: string
  author: string
  tags: Array<string>
  title: string
  excerpt: string
  content: string
}

export interface UpdateArticleInput {
  slug?: string
  author?: string
  tags?: Array<string>
  title?: string
  excerpt?: string
  content?: string
  updatedAt?: string
}

export interface ArticlesListResponse {
  items: Array<Article>
  nextCursor?: string
}

export interface FetchArticlesParams {
  lang: string
  cursor?: string
  limit?: number
  q?: string
}

export interface FetchArticlesByGroupParams {
  lang: string
  cursor?: string
  limit?: number
}

export interface FetchArticleGroupsParams {
  lang?: string
  cursor?: string
  limit?: number
  q?: string
}

export type ArticleGroupSupportLang = 'en' | 'es'

export interface ArticleGroup {
  groupId: string
  support: Array<ArticleGroupSupportLang>
  title: string
  excerpt: string
  publishedAt: string
}

export interface ArticleGroupsResponse {
  items: Array<ArticleGroup>
  nextCursor?: string
}

export interface UpdateArticleMutationParams {
  id: string
  input: UpdateArticleInput
}
