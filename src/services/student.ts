import axiosInstance from '@/lib/axiosInstance'
import type { PageQueryType, ResponseType } from '@/types'
import type { StudentList } from '@/types/student'

export async function getStudent(PageQuery: PageQueryType, classId?: string): Promise<ResponseType<StudentList[]>> {
  const response = await axiosInstance.get(`/students`, {
    params: { ...PageQuery, class_id: classId },
  })
  return response.data
}
