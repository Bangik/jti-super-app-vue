import type { LoginValues } from '@/constants/forms/auth'
import axiosInstance from '@/lib/axiosInstance'
import type { ResponseType } from '@/types'
import type { LoginResponse } from '@/types/auth'

export const useLogin = async (data: LoginValues): Promise<ResponseType<LoginResponse>> => {
  const response = await axiosInstance.post('/auth/login', data)
  return response.data
}

export const logoutService = async (): Promise<ResponseType<string>> => {
  const response = await axiosInstance.post('/auth/logout')
  return response.data
}
