import { logoutService, me } from '@/services/auth'
import { useAuthStore } from '@/stores/auth-store'
import type { ResponseType } from '@/types'
import type { MeResponse } from '@/types/auth'
import { useMutation, useQuery } from '@tanstack/vue-query'
import nProgress from 'nprogress'

export const useLogout = () => {
  const authStore = useAuthStore()
  return useMutation({
    mutationFn: logoutService,
    onMutate: () => {
      nProgress.start()
    },
    onSuccess: () => {
      authStore.$reset()
      window.location.href = '/login'
    },
    onSettled: () => {
      nProgress.done()
    },
  })
}

export const useMe = () => {
  const authStore = useAuthStore()
  const query = useQuery<ResponseType<MeResponse>, Error>({
    queryKey: ['me'],
    queryFn: () => me(),
  })

  if (query.data?.value?.data) {
    authStore.setUser(query.data.value.data)
  }

  return query
}
