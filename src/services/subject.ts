import type { SubjectValues } from '@/constants/forms/subject'
import axiosInstance from '@/lib/axiosInstance'
import type { PageQueryType, ResponseType } from '@/types'
import type { SubjectList, SubjectOption } from '@/types/subject'

export const getSubject = async (PageQuery: PageQueryType): Promise<ResponseType<SubjectList[]>> => {
  const response = await axiosInstance.get(`/subjects`, {
    params: { ...PageQuery },
  })
  return response.data
}

export const getSubjectAsOptions = async (
  studyProgramId?: string,
  semesterId?: string,
): Promise<ResponseType<SubjectOption[]>> => {
  const response = await axiosInstance.get(`/subjects/options`, {
    params: { study_program_id: studyProgramId, semester_id: semesterId },
  })
  return response.data
}

export const addSubject = async (data: SubjectValues): Promise<ResponseType> => {
  const response = await axiosInstance.post(`/subjects`, data)
  return response.data
}

export const updateSubject = async (id: string, data: SubjectValues): Promise<ResponseType> => {
  const response = await axiosInstance.put(`/subjects/${id}`, data)
  return response.data
}

export const deleteSubject = async (id: string): Promise<ResponseType> => {
  const response = await axiosInstance.delete(`/subjects/${id}`)
  return response.data
}
