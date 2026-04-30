import type { StudentUpdateValues, StudentValues } from '@/constants/forms/student'
import axiosInstance from '@/lib/axiosInstance'
import type { PageQueryType, ResponseType } from '@/types'
import type { StudentDetail, StudentList, StudentOptions } from '@/types/student'

export async function getStudent(PageQuery: PageQueryType): Promise<ResponseType<StudentList[]>> {
  const response = await axiosInstance.get(`/students`, {
    params: { ...PageQuery },
  })
  return response.data
}

export const getStudentAsOptions = async (
  major_id?: string,
  study_program_id?: string,
): Promise<ResponseType<StudentOptions[]>> => {
  const response = await axiosInstance.get(`/students/options`, {
    params: {
      major_id,
      study_program_id,
    },
  })
  return response.data
}

export const addStudent = async (data: StudentValues): Promise<ResponseType> => {
  const response = await axiosInstance.post(`/students`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const updateStudent = async (id: string, data: StudentUpdateValues): Promise<ResponseType> => {
  const response = await axiosInstance.post(`/students/${id}/update`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const getStudentById = async (id: string): Promise<ResponseType<StudentDetail>> => {
  const response = await axiosInstance.get(`/students/${id}`)
  return response.data
}
