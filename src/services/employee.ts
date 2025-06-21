import type { EmployeeValues } from '@/constants/forms/employee'
import axiosInstance from '@/lib/axiosInstance'
import type { PageQueryType, ResponseType } from '@/types'
import type { EmployeeDetail, EmployeeList, EmployeeOption, Position } from '@/types/employee'

export const getEmployee = async (PageQuery: PageQueryType): Promise<ResponseType<EmployeeList[]>> => {
  const response = await axiosInstance.get(`/employees`, {
    params: PageQuery,
  })
  return response.data
}

export const getEmployeeAsOptions = async (
  majorId?: string,
  position?: Position,
): Promise<ResponseType<EmployeeOption[]>> => {
  const response = await axiosInstance.get(`/employees/options`, {
    params: {
      majorId,
      position,
    },
  })
  return response.data
}

export const getEmployeeById = async (id: string): Promise<ResponseType<EmployeeDetail>> => {
  const response = await axiosInstance.get(`/employees/${id}`)
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
  const response = await axiosInstance.post(`/employees/${id}/update`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const deleteEmployee = async (id: string): Promise<ResponseType<void>> => {
  const response = await axiosInstance.delete(`/employees/${id}`)
  return response.data
}
