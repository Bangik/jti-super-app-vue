import { logoutService } from '@/services/auth'
import type { LoginStore } from '@/types/auth'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth-store', {
  state: (): LoginStore => ({
    token: '',
    server: import.meta.env.VITE_API_URL,
    user: {
      id: '',
      email: '',
      name: '',
      avatar_url: '',
      roles: [],
      permissions: [],
    },
  }),

  getters: {
    getToken(state) {
      return state.token
    },
    getUser(state) {
      return state.user
    },
    isLoggedIn(state) {
      return !!state.token && state.token !== ''
    },
    getUserAccess(state) {
      return {
        token: state.token,
        user: state.user,
        server: state.server,
      }
    },
  },

  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUser(user: LoginStore['user']) {
      this.user = user
    },
    setServer(server: string) {
      this.server = server
    },
    setUserAccess(data: Partial<LoginStore>) {
      if (data.token) this.token = data.token
      if (data.user) this.user = data.user
      if (data.server) this.server = data.server
    },

    async logout() {
      try {
        const response = await logoutService()

        if (response.status_code === 200) {
          this.$reset()
        }
      } catch (error) {
        console.error('Error logging out:', error)
        this.$reset()
        window.location.href = '/login'
      }
    },
    initializeFromStorage() {
      try {
        const stored = localStorage.getItem('auth-store')
        if (stored) {
          const data = JSON.parse(stored) as LoginStore
          this.setUserAccess(data)
        }
      } catch (error) {
        console.error('Error loading auth from storage:', error)
        this.logout()
      }
    },
  },
  persist: true,
})
