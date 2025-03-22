import { useAuthStore } from '@/stores/auth-store'
export const useRedirectHome = () => {
  const authStore = useAuthStore()

  if (!authStore.isLoggedIn) return false

  return true
}
