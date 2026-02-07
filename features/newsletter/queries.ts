import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import type { UpdateArticleMutationParams } from '@/features/newsletter/contracts/article'
import {
  createArticle,
  deleteArticle,
  deleteArticleGroup,
  fetchArticleByGroup,
  fetchArticleGroups,
  fetchArticles,
  fetchArticlesByGroup,
  updateArticle,
} from '@/api/articles'

const DEFAULT_PAGE_SIZE = 10

export const newsletterKeys = {
  all: ['newsletter'] as const,
  lists: (lang: string) => [...newsletterKeys.all, 'list', lang] as const,
  list: (lang: string, cursor?: string, q?: string) =>
    [...newsletterKeys.lists(lang), cursor ?? '', q ?? ''] as const,
  listsByGroup: (lang: string) =>
    [...newsletterKeys.all, 'listByGroup', lang] as const,
  listByGroup: (lang: string, cursor?: string) =>
    [...newsletterKeys.listsByGroup(lang), cursor ?? ''] as const,
  groups: (lang: string, cursor?: string, q?: string) =>
    [...newsletterKeys.all, 'groups', lang, cursor ?? '', q ?? ''] as const,
  byGroup: (groupId: string, lang: string) =>
    [...newsletterKeys.all, 'byGroup', groupId, lang] as const,
}

export function useArticlesInfiniteQuery(
  lang: string,
  options?: { q?: string; pageSize?: number; enabled?: boolean },
) {
  const pageSize = options?.pageSize ?? DEFAULT_PAGE_SIZE
  const q = options?.q?.trim() ?? ''
  const enabled = options?.enabled ?? true
  return useInfiniteQuery({
    queryKey: newsletterKeys.list(lang, undefined, q),
    queryFn: ({ pageParam }) =>
      fetchArticles({ lang, cursor: pageParam, limit: pageSize, q }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor,
    refetchOnMount: 'always',
    enabled,
  })
}

export function useArticlesByGroupInfiniteQuery(
  lang: string,
  options?: { pageSize?: number; enabled?: boolean },
) {
  const pageSize = options?.pageSize ?? DEFAULT_PAGE_SIZE
  const enabled = options?.enabled ?? true
  return useInfiniteQuery({
    queryKey: newsletterKeys.listByGroup(lang, undefined),
    queryFn: ({ pageParam }) =>
      fetchArticlesByGroup({ lang, cursor: pageParam, limit: pageSize }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor,
    refetchOnMount: 'always',
    enabled,
  })
}

export function useArticleGroupsInfiniteQuery(
  lang: string,
  options?: { pageSize?: number; q?: string; enabled?: boolean },
) {
  const pageSize = options?.pageSize ?? DEFAULT_PAGE_SIZE
  const q = options?.q?.trim() ?? ''
  const enabled = options?.enabled ?? true
  return useInfiniteQuery({
    queryKey: newsletterKeys.groups(lang, undefined, q),
    queryFn: ({ pageParam }) =>
      fetchArticleGroups({ lang, cursor: pageParam, limit: pageSize, q }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor,
    refetchOnMount: 'always',
    enabled,
  })
}

export function useArticleByGroupQuery(
  groupId: string | undefined,
  lang: string,
) {
  return useQuery({
    queryKey: newsletterKeys.byGroup(groupId ?? '', lang),
    queryFn: () =>
      groupId ? fetchArticleByGroup(groupId, lang) : Promise.resolve(null),
    enabled: Boolean(groupId),
  })
}

export function useCreateArticleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createArticle,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.all })
      queryClient.invalidateQueries({
        queryKey: newsletterKeys.lists(variables.lang),
      })
      queryClient.invalidateQueries({
        queryKey: newsletterKeys.listsByGroup(variables.lang),
      })
      queryClient.invalidateQueries({ queryKey: newsletterKeys.groups('es') })
      queryClient.invalidateQueries({ queryKey: newsletterKeys.groups('en') })
      if (variables.groupId) {
        queryClient.invalidateQueries({
          queryKey: newsletterKeys.byGroup(variables.groupId, variables.lang),
        })
      }
    },
  })
}

export function useUpdateArticleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: UpdateArticleMutationParams) =>
      updateArticle(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.all })
      queryClient.invalidateQueries({
        queryKey: [...newsletterKeys.all, 'byGroup'],
      })
      queryClient.invalidateQueries({
        queryKey: newsletterKeys.listsByGroup('es'),
      })
      queryClient.invalidateQueries({
        queryKey: newsletterKeys.listsByGroup('en'),
      })
      queryClient.invalidateQueries({ queryKey: newsletterKeys.groups('es') })
      queryClient.invalidateQueries({ queryKey: newsletterKeys.groups('en') })
    },
  })
}

export function useDeleteArticleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.all })
    },
  })
}

export function useDeleteArticleGroupMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteArticleGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.all })
      queryClient.invalidateQueries({
        queryKey: newsletterKeys.listsByGroup('es'),
      })
      queryClient.invalidateQueries({
        queryKey: newsletterKeys.listsByGroup('en'),
      })
      queryClient.invalidateQueries({ queryKey: newsletterKeys.groups('es') })
      queryClient.invalidateQueries({ queryKey: newsletterKeys.groups('en') })
    },
  })
}
