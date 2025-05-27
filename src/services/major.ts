import type { MajorValues } from '@/constants/forms/major'
import axiosInstance from '@/lib/axiosInstance'
import type { PageQueryType, ResponseType } from '@/types'
import type { MajorOption } from '@/types/major'

export async function getMajor(PageQuery: PageQueryType) {
  const response = await axiosInstance.get(`/majors`, {
    params: PageQuery,
  })
  return response.data
}

export const getMajorAsOptions = async (): Promise<ResponseType<MajorOption[]>> => {
  const response = await axiosInstance.get(`/majors/options`)
  return response.data
}

export const addMajor = async (data: MajorValues): Promise<ResponseType> => {
  const response = await axiosInstance.post(`/majors`, data)
  return response.data
}

export const updateMajor = async (id: string, data: MajorValues): Promise<ResponseType> => {
  const response = await axiosInstance.put(`/majors/${id}`, data)
  return response.data
}

export const deleteMajor = async (id: string): Promise<ResponseType> => {
  const response = await axiosInstance.delete(`/majors/${id}`)
  return response.data
}
