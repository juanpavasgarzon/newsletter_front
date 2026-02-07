import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { SubscribeMutationInput } from '@/features/newsletter/contracts/subscription'
import { subscribe } from '@/api/subscriptions'

export function useSubscribeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SubscribeMutationInput) =>
      subscribe({
        email: input.email.trim().toLowerCase(),
        lang: input.lang ?? 'es',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site', 'basic-info'] })
    },
  })
}
