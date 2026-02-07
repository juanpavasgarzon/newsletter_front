import type {
  Article,
  ArticleGroupsResponse,
  ArticlesListResponse,
  CreateArticleInput,
  FetchArticleGroupsParams,
  FetchArticlesByGroupParams,
  FetchArticlesParams,
  UpdateArticleInput,
} from '@/features/newsletter/contracts/article'
import { ApiError, request } from '@/api/client'

export { ApiError }

function requestAuth<T>(path: string, options: RequestInit = {}): Promise<T> {
  return request<T>(path, { ...options, authenticated: true })
}

function buildSearchParams(params: FetchArticlesParams): string {
  const sp = new URLSearchParams()
  sp.set('lang', params.lang)
  if (params.cursor) sp.set('cursor', params.cursor)
  if (params.limit != null) sp.set('limit', String(params.limit))
  if (params.q?.trim()) sp.set('q', params.q.trim())
  return sp.toString()
}

export async function fetchArticles(
  params: FetchArticlesParams,
): Promise<ArticlesListResponse> {
  const query = buildSearchParams(params)
  return requestAuth<ArticlesListResponse>(`/articles?${query}`)
}

function buildByGroupSearchParams(
  params: FetchArticlesByGroupParams,
): string {
  const sp = new URLSearchParams()
  sp.set('lang', params.lang)
  if (params.cursor) sp.set('cursor', params.cursor)
  if (params.limit != null) sp.set('limit', String(params.limit))
  return sp.toString()
}

export async function fetchArticlesByGroup(
  params: FetchArticlesByGroupParams,
): Promise<ArticlesListResponse> {
  const query = buildByGroupSearchParams(params)
  return requestAuth<ArticlesListResponse>(`/articles/by-group?${query}`)
}

function buildGroupsSearchParams(
  params: FetchArticleGroupsParams,
): string {
  const sp = new URLSearchParams()
  if (params.lang) sp.set('lang', params.lang)
  if (params.cursor) sp.set('cursor', params.cursor)
  if (params.limit != null) sp.set('limit', String(params.limit))
  if (params.q?.trim()) sp.set('q', params.q.trim())
  return sp.toString()
}

export async function fetchArticleGroups(
  params: FetchArticleGroupsParams,
): Promise<ArticleGroupsResponse> {
  const query = buildGroupsSearchParams(params)
  return requestAuth<ArticleGroupsResponse>(`/articles/groups?${query}`)
}

export async function fetchArticleByGroup(
  groupId: string,
  lang: string,
): Promise<Article | null> {
  try {
    return await requestAuth<Article>(
      `/articles/by-group/${encodeURIComponent(groupId)}?lang=${encodeURIComponent(lang)}`,
    )
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) {
      return null
    }
    throw e
  }
}

export async function createArticle(
  input: CreateArticleInput,
): Promise<Article> {
  return requestAuth<Article>('/articles', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function updateArticle(
  id: string,
  input: UpdateArticleInput,
): Promise<Article> {
  return requestAuth<Article>(`/articles/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export async function deleteArticle(id: string): Promise<void> {
  await requestAuth<unknown>(`/articles/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}

export async function deleteArticleGroup(groupId: string): Promise<void> {
  await requestAuth<unknown>(
    `/articles/group/${encodeURIComponent(groupId)}`,
    { method: 'DELETE' },
  )
}
