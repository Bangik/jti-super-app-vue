import axiosInstance from '@/lib/axiosInstance'
import type { ResponseType } from '@/types'
import type { GradeHistoryData, GradeUpdatePayload, GradeUpdateResponse } from '@/types/grade'

export const getGradeHistory = async (
  studentId: string,
  semesterId: string,
): Promise<ResponseType<GradeHistoryData>> => {
  const response = await axiosInstance.get('/grades/history', {
    params: {
      student_id: studentId,
      semester_id: semesterId,
    },
  })

  return response.data
}

export const updateGradeById = async (
  id: string,
  data: GradeUpdatePayload,
): Promise<ResponseType<GradeUpdateResponse>> => {
  const response = await axiosInstance.put(`/grades/${id}`, data)

  return response.data
}
