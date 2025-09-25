import axiosInstance from '@/lib/axiosInstance'
import type { PageQueryType, ResponseType } from '@/types'
import type { UserDetail } from '@/types/user'

export const getUser = async (PageQuer: PageQueryType): Promise<ResponseType<UserDetail[]>> => {
  const response = await axiosInstance.get(`/users`, {
    params: { ...PageQuer },
  })
  return response.data
}

export const updateRoles = async (id: string, roles: string[]): Promise<ResponseType<UserDetail>> => {
  const response = await axiosInstance.put(`/users/${id}/roles`, { role_ids: roles })
  return response.data
}
