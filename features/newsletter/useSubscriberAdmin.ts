import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  fetchSubscribers,
  unsubscribePost,
} from '@/api/subscriptions'

const SUBSCRIBERS_KEY = ['subscribe', 'list'] as const
const PAGE_SIZE = 20

export function useSubscribersInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: SUBSCRIBERS_KEY,
    queryFn: ({ pageParam }) =>
      fetchSubscribers({
        cursor: pageParam,
        limit: PAGE_SIZE,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor,
  })
}

export function useUnsubscribeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (email: string) =>
      unsubscribePost({ email: email.trim().toLowerCase() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIBERS_KEY })
      queryClient.invalidateQueries({ queryKey: ['site', 'basic-info'] })
    },
  })
}
