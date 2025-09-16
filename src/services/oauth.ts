import type { OauthClientValues } from '@/constants/forms/oauth'
import axiosInstance from '@/lib/axiosInstance'
import type { PageQueryType, ResponseType } from '@/types'
import type { OauthClient } from '@/types/oauth'

export async function getOAuthClients(PageQuery: PageQueryType): Promise<ResponseType<OauthClient[]>> {
  const response = await axiosInstance.get(`/oauth-clients`, {
    params: { ...PageQuery },
  })
  return response.data
}

export async function addOauthClient(data: OauthClientValues): Promise<ResponseType> {
  const response = await axiosInstance.post(`/oauth-clients`, data)
  return response.data
}

export async function updateOAuthClient(id: string, data: OauthClientValues): Promise<ResponseType> {
  const response = await axiosInstance.put(`/oauth-clients/${id}`, data)
  return response.data
}

export const deleteOAuthClient = async (id: string): Promise<ResponseType> => {
  const response = await axiosInstance.delete(`/oauth-clients/${id}`)
  return response.data
}
