import type { SemesterValues } from '@/constants/forms/semester'
import axiosInstance from '@/lib/axiosInstance'
import type { PageQueryType, ResponseType } from '@/types'
import type { SemesterList } from '@/types/semester'

export const getSemester = async (PageQuery: PageQueryType): Promise<ResponseType<SemesterList[]>> => {
  const response = await axiosInstance.get(`/semesters`, {
    params: PageQuery,
  })
  return response.data
}

export const addSemester = async (data: SemesterValues): Promise<ResponseType> => {
  const response = await axiosInstance.post(`/semesters`, data)
  return response.data
}

export const updateSemester = async (id: string, data: SemesterValues): Promise<ResponseType> => {
  const response = await axiosInstance.put(`/semesters/${id}`, data)
  return response.data
}

export const deleteSemester = async (id: string): Promise<ResponseType> => {
  const response = await axiosInstance.delete(`/semesters/${id}`)
  return response.data
}
