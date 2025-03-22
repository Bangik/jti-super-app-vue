import { useAuthStore } from '@/stores/auth-store'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/v1',
  timeout: 120000,
})

axiosInstance.interceptors.request.use(
  config => {
    const authStore = useAuthStore()
    const token = authStore.getToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else if (config.method !== 'post') {
      window.location.href = '/login'
    }

    const baseUrl = authStore.server
    const parsedUrl = new URL(baseUrl)

    const domain = `${parsedUrl.protocol}//${parsedUrl.host}`
    const mockDomains = ['https://mock.apidog.com', 'http://127.0.0.1:3658']

    config.baseURL = mockDomains.includes(domain) ? baseUrl : baseUrl + '/v1'

    return config
  },
  error => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    const originalRequest = error.config
    const toast = useToast()

    if (error.response?.status === 403) {
      toast.error('You do not have permission to access this resource.')
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const authStore = useAuthStore()
      const refreshToken = authStore.getToken

      if (!refreshToken) {
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const response = await axiosInstance.post('/auth/refresh', { refresh_token: refreshToken })

        if (response.status === 200) {
          const token = response.data.data.token
          authStore.setToken(token)

          originalRequest.headers.Authorization = `Bearer ${token}`
          return axiosInstance(originalRequest)
        }
      } catch (error) {
        console.error('Error refreshing token:', error)
        authStore.logout()
      }
    }

    // Handle other errors
    if (error.response) {
      const message =
        error.response.status !== 500 ? error.response.data?.message || 'Something went wrong' : 'Something went wrong'

      if (error.response.status !== 401 && !originalRequest._retry) {
        toast.error(message)
      }

      console.error(message)
    } else {
      toast.error('Network error. Please check your connection.')
      console.error('Network error:', error)
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
