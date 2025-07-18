import type { ForgotPasswordValues, LoginValues, ResetPasswordValues } from '@/constants/forms/auth'
import axiosInstance from '@/lib/axiosInstance'
import type { ResponseType } from '@/types'
import type { LoginResponse, MeResponse } from '@/types/auth'

export const useLogin = async (data: LoginValues): Promise<ResponseType<LoginResponse>> => {
  const response = await axiosInstance.post('/auth/login', data)
  return response.data
}

export const useForgotPassword = async (data: ForgotPasswordValues): Promise<ResponseType<string>> => {
  const response = await axiosInstance.post('/auth/password/forgot', data)
  return response.data
}

export const useResetPassword = async (data: ResetPasswordValues): Promise<ResponseType<string>> => {
  const response = await axiosInstance.post('/auth/password/reset', data)
  return response.data
}

export const logoutService = async (): Promise<ResponseType<string>> => {
  const response = await axiosInstance.post('/auth/logout')
  return response.data
}

export const me = async (): Promise<ResponseType<MeResponse>> => {
  const response = await axiosInstance.get('/auth/me')
  return response.data
}
