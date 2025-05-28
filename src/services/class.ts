import type { ClassValues } from '@/constants/forms/class'
import axiosInstance from '@/lib/axiosInstance'
import type { PageQueryType, ResponseType } from '@/types'
import type { ClassList } from '@/types/class'

export async function getClass(PageQuery: PageQueryType, studyProgramId?: string): Promise<ResponseType<ClassList[]>> {
  const response = await axiosInstance.get(`/classes`, {
    params: { ...PageQuery, study_program_id: studyProgramId },
  })
  return response.data
}

export const addClass = async (data: ClassValues): Promise<ResponseType> => {
  const response = await axiosInstance.post(`/classes`, data)
  return response.data
}

export const updateClass = async (id: string, data: ClassValues): Promise<ResponseType> => {
  const response = await axiosInstance.put(`/classes/${id}`, data)
  return response.data
}

export const deleteClass = async (id: string): Promise<ResponseType> => {
  const response = await axiosInstance.delete(`/classes/${id}`)
  return response.data
}
