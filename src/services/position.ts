import type { PositionValues } from '@/constants/forms/position'
import axiosInstance from '@/lib/axiosInstance'
import type { PageQueryType, ResponseType } from '@/types'
import type { PositionList, PositionOption } from '@/types/position'

export const getPosition = async (pageQuery: PageQueryType): Promise<ResponseType<PositionList[]>> => {
  const response = await axiosInstance.get(`/positions`, {
    params: pageQuery,
  })
  return response.data
}

export const getPositionAsOptions = async (): Promise<ResponseType<PositionOption[]>> => {
  const response = await axiosInstance.get(`/positions/options`)
  return response.data
}

export const getPositionById = async (id: string): Promise<ResponseType<PositionList>> => {
  const response = await axiosInstance.get(`/positions/${id}`)
  return response.data
}

export const addPosition = async (data: PositionValues): Promise<ResponseType<null>> => {
  const response = await axiosInstance.post(`/positions`, data)
  return response.data
}

export const updatePosition = async (id: string, data: PositionValues): Promise<ResponseType<null>> => {
  const response = await axiosInstance.put(`/positions/${id}`, data)
  return response.data
}

export const deletePosition = async (id: string): Promise<ResponseType<null>> => {
  const response = await axiosInstance.delete(`/positions/${id}`)
  return response.data
}
