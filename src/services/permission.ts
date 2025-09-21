import type { PermissionValues } from '@/constants/forms/permission'
import axiosInstance from '@/lib/axiosInstance'
import type { PageQueryType, ResponseType } from '@/types'
import type { Permission, PermissionOption } from '@/types/permission'

export async function getPermissions(pageQuery: PageQueryType): Promise<ResponseType<Permission[]>> {
  const response = await axiosInstance.get(`/permissions`, {
    params: { ...pageQuery },
  })
  return response.data
}

export const getPermissionsAsOptions = async (): Promise<ResponseType<PermissionOption[]>> => {
  const response = await axiosInstance.get(`/permissions/options`)
  return response.data
}

export async function addPermissions(data: PermissionValues): Promise<ResponseType> {
  const response = await axiosInstance.post(`/permissions`, data)
  return response.data
}

export async function updatePermissions(id: string, data: PermissionValues): Promise<ResponseType> {
  const response = await axiosInstance.put(`/permissions/${id}`, data)
  return response.data
}

export const deletePermissions = async (id: string): Promise<ResponseType> => {
  const response = await axiosInstance.delete(`/permissions/${id}`)
  return response.data
}
