import type { RoomValues } from '@/constants/forms/room'
import axiosInstance from '@/lib/axiosInstance'
import type { PageQueryType, ResponseType } from '@/types'
import type { Room, RoomOption } from '@/types/room'

const BASE_URL = '/rooms'

export const getRooms = async (pageQuery: PageQueryType): Promise<ResponseType<Room[]>> => {
  const response = await axiosInstance.get(BASE_URL, {
    params: pageQuery,
  })
  return response.data
}

export const getRoomAsOptions = async (): Promise<ResponseType<RoomOption[]>> => {
  const response = await axiosInstance.get(`${BASE_URL}/options`)
  return response.data
}

export const getRoomById = async (id: string) => {
  const response = await axiosInstance.get(`${BASE_URL}/${id}`)
  return response.data
}

export const createRoom = async (payload: RoomValues) => {
  const response = await axiosInstance.post(BASE_URL, payload)
  return response.data
}

export const updateRoom = async (id: string, payload: RoomValues) => {
  const response = await axiosInstance.put(`${BASE_URL}/${id}`, payload)
  return response.data
}

export const deleteRoom = async (id: string) => {
  const response = await axiosInstance.delete(`${BASE_URL}/${id}`)
  return response.data
}
