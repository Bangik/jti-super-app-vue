import { logoutService } from '@/services/auth'
import { useAuthStore } from '@/stores/auth-store'
import { useMutation } from '@tanstack/vue-query'
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
