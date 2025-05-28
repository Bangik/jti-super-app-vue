import type { StudyProgramValues } from '@/constants/forms/study-program'
import axiosInstance from '@/lib/axiosInstance'
import type { PageQueryType, ResponseType } from '@/types'
import type { StudyProgramList, StudyProgramOption } from '@/types/study-program'

export async function getStudyProgram(
  PageQuery: PageQueryType,
  majorId?: string,
): Promise<ResponseType<StudyProgramList[]>> {
  const response = await axiosInstance.get(`/study-programs`, {
    params: { ...PageQuery, major_id: majorId },
  })
  return response.data
}

export const getStudyProgramAsOptions = async (): Promise<ResponseType<StudyProgramOption[]>> => {
  const response = await axiosInstance.get(`/study-programs/options`)
  return response.data
}

export const addStudyProgram = async (data: StudyProgramValues): Promise<ResponseType> => {
  const response = await axiosInstance.post(`/study-programs`, data)
  return response.data
}

export const updateStudyProgram = async (id: string, data: StudyProgramValues): Promise<ResponseType> => {
  const response = await axiosInstance.put(`/study-programs/${id}`, data)
  return response.data
}

export const deleteStudyProgram = async (id: string): Promise<ResponseType> => {
  const response = await axiosInstance.delete(`/study-programs/${id}`)
  return response.data
}
