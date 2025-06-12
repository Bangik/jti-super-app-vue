import type { EmployeeValues } from '@/constants/forms/employee'
import axiosInstance from '@/lib/axiosInstance'
import type { PageQueryType, ResponseType } from '@/types'
import type { EmployeeList } from '@/types/employee'

export const getEmployee = async (PageQuery: PageQueryType): Promise<ResponseType<EmployeeList[]>> => {
  const response = await axiosInstance.get(`/employees`, {
    params: PageQuery,
  })
  return response.data
}

export const addEmployee = async (data: EmployeeValues): Promise<ResponseType> => {
  const response = await axiosInstance.post(`/employees`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const updateEmployee = async (id: string, data: EmployeeValues): Promise<ResponseType> => {
  const response = await axiosInstance.put(`/employees/${id}`, data)
  return response.data
}

export const deleteEmployee = async (id: string): Promise<ResponseType<void>> => {
  const response = await axiosInstance.delete(`/employees/${id}`)
  return response.data
}
