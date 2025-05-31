import axiosInstance from '@/lib/axiosInstance'
import type { PageQueryType, ResponseType } from '@/types'
import type { EmployeeList } from '@/types/employee'

export const getEmployee = async (PageQuery: PageQueryType): Promise<ResponseType<EmployeeList[]>> => {
  const response = await axiosInstance.get(`/employees`, {
    params: PageQuery,
  })
  return response.data
}

export const deleteEmployee = async (id: string): Promise<ResponseType<void>> => {
  const response = await axiosInstance.delete(`/employees/${id}`)
  return response.data
}
