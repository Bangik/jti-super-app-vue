import type { SessionValues } from '@/constants/forms/session'
import axiosInstance from '@/lib/axiosInstance'
import type { PageQueryType, ResponseType } from '@/types'
import type { SessionList, SessionOption } from '@/types/session'

export const getSession = async (PageQuery: PageQueryType): Promise<ResponseType<SessionList[]>> => {
  const response = await axiosInstance.get(`/sessions`, {
    params: PageQuery,
  })
  return response.data
}

export const getSessionAsOptions = async (): Promise<ResponseType<SessionOption[]>> => {
  const response = await axiosInstance.get(`/sessions/options`)
  return response.data
}

export const addSession = async (data: SessionValues): Promise<ResponseType> => {
  const response = await axiosInstance.post(`/sessions`, data)
  return response.data
}

export const updateSession = async (id: string, data: SessionValues): Promise<ResponseType> => {
  const response = await axiosInstance.put(`/sessions/${id}`, data)
  return response.data
}
export const deleteSession = async (id: string): Promise<ResponseType> => {
  const response = await axiosInstance.delete(`/sessions/${id}`)
  return response.data
}
