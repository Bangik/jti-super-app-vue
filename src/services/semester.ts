import type { SemesterValues } from '@/constants/forms/semester'
import axiosInstance from '@/lib/axiosInstance'
import type { PageQueryType, ResponseType } from '@/types'
import type { SemesterList, SemesterOptions } from '@/types/semester'

export const getSemester = async (PageQuery: PageQueryType): Promise<ResponseType<SemesterList[]>> => {
  const response = await axiosInstance.get(`/semesters`, {
    params: PageQuery,
  })
  return response.data
}

export const getSemesterOptions = async (sessionId?: string): Promise<ResponseType<SemesterOptions[]>> => {
  const response = await axiosInstance.get(`/semesters/options`, {
    params: {
      session_id: sessionId,
    },
  })
  return response.data
}

export const settingSubjectSemester = async (semesterId: string, subjectIds: string[]): Promise<ResponseType> => {
  const response = await axiosInstance.post(`/semesters/${semesterId}/setting-subjects`, { subject_ids: subjectIds })
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
