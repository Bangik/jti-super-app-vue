import { useRedirectHome } from '@/composables/redirect-home'
import { useAuthStore } from '@/stores/auth-store'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useToast } from 'vue-toastification'

const handleNavigation = (to: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = useAuthStore()
  const toast = useToast()
  const token = authStore.getToken

  if (to.name == 'login') {
    const redirectHome = useRedirectHome()

    if (!redirectHome) {
      return next()
    } else {
      return next({ name: 'dashboard.index' })
    }
  }

  if (to.meta.roles) {
    const roles = to.meta.roles as string[]

    if (!roles.some(role => authStore.user.roles.includes(role))) {
      toast.error('You do not have permission to access this resource.')
      return next({ name: 'dashboard.index' })
    }
  }

  if (!token) {
    toast.error('Please login first')
    return next({ name: 'login' })
  }

  next()
}

export default handleNavigation
