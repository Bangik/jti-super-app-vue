import type { OrgUnitHeadValues, OrgUnitValues } from '@/constants/forms/org-unit'
import axiosInstance from '@/lib/axiosInstance'
import type { PageQueryType, ResponseType } from '@/types'
import type { HistoryHead, OrgUnitList, OrgUnitOption } from '@/types/org-unit'

export const getOrgUnit = async (pageQuery: PageQueryType): Promise<ResponseType<OrgUnitList[]>> => {
  const response = await axiosInstance.get(`/org-units`, {
    params: pageQuery,
  })
  return response.data
}

export const getOrgUnitAsOptions = async (): Promise<ResponseType<OrgUnitOption[]>> => {
  const response = await axiosInstance.get(`/org-units/options`)
  return response.data
}

export const getOrgUnitById = async (id: string): Promise<ResponseType<OrgUnitList>> => {
  const response = await axiosInstance.get(`/org-units/${id}`)
  return response.data
}

export const addOrgUnit = async (data: OrgUnitValues): Promise<ResponseType<null>> => {
  const response = await axiosInstance.post(`/org-units`, data)
  return response.data
}

export const updateOrgUnit = async (id: string, data: OrgUnitValues): Promise<ResponseType<null>> => {
  const response = await axiosInstance.put(`/org-units/${id}`, data)
  return response.data
}

export const deleteOrgUnit = async (id: string): Promise<ResponseType<null>> => {
  const response = await axiosInstance.delete(`/org-units/${id}`)
  return response.data
}

export const getHistoryHeadById = async (
  id: string,
  pageQuery: PageQueryType,
): Promise<ResponseType<HistoryHead[]>> => {
  const response = await axiosInstance.get(`/org-units/${id}/history`, {
    params: pageQuery,
  })
  return response.data
}

export const addHeadOrgUnit = async (id: string, data: OrgUnitHeadValues): Promise<ResponseType<null>> => {
  const response = await axiosInstance.post(`/org-units/${id}/heads`, data)
  return response.data
}

export const deactivateHeadOrgUnit = async (id: string, assignmentId: string): Promise<ResponseType<null>> => {
  const response = await axiosInstance.delete(`/org-units/${id}/heads/${assignmentId}`)
  return response.data
}
