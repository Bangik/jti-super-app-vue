import type { ScheduleValues } from '@/constants/forms/schedule'
import axiosInstance from '@/lib/axiosInstance'
import type { PageQueryType, ResponseType } from '@/types'
import type { ScheduleList } from '@/types/schedule'

const BASE_URL = '/schedules'

export const getSchedule = async (pageQuery: PageQueryType): Promise<ResponseType<ScheduleList[]>> => {
  const response = await axiosInstance.get(BASE_URL, {
    params: pageQuery,
  })
  return response.data
}

export const getSheduleById = async (id: string): Promise<ResponseType<ScheduleList>> => {
  const response = await axiosInstance.get(`${BASE_URL}/${id}`)
  return response.data
}

export const createSchedule = async (payload: ScheduleValues): Promise<ResponseType> => {
  const response = await axiosInstance.post(BASE_URL, payload)
  return response.data
}

export const updateSchedule = async (id: string, payload: ScheduleValues): Promise<ResponseType> => {
  const response = await axiosInstance.put(`${BASE_URL}/${id}`, payload)
  return response.data
}

export const deleteSchedule = async (id: string): Promise<ResponseType> => {
  const response = await axiosInstance.delete(`${BASE_URL}/${id}`)
  return response.data
}
