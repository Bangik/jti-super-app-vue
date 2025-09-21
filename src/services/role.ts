import type { RoleValues } from '@/constants/forms/role'
import axiosInstance from '@/lib/axiosInstance'
import type { PageQueryType, ResponseType } from '@/types'
import type { Role } from '@/types/role'

export async function getRoles(pageQuery: PageQueryType): Promise<ResponseType<Role[]>> {
  const response = await axiosInstance.get(`/roles`, {
    params: { ...pageQuery },
  })
  return response.data
}

export async function addRoles(data: RoleValues): Promise<ResponseType> {
  const response = await axiosInstance.post(`/roles`, data)
  return response.data
}

export async function updateRoles(id: string, data: RoleValues): Promise<ResponseType> {
  const response = await axiosInstance.put(`/roles/${id}`, data)
  return response.data
}

export const deleteRoles = async (id: string): Promise<ResponseType> => {
  const response = await axiosInstance.delete(`/roles/${id}`)
  return response.data
}
