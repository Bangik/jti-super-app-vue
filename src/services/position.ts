import type { PositionValues } from '@/constants/forms/position'
import axiosInstance from '@/lib/axiosInstance'
import type { PageQueryType, ResponseType } from '@/types'
import type { PositionList, PositionOption } from '@/types/position'

const parseAllowedUnitTypes = (value: unknown): string[] | null => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string')
  }

  if (value == null) {
    return null
  }

  if (typeof value !== 'string' || !value.trim()) {
    return null
  }

  try {
    const parsedValue = JSON.parse(value)

    if (Array.isArray(parsedValue)) {
      return parsedValue.filter((item): item is string => typeof item === 'string')
    }

    return null
  } catch {
    const parsedItems = value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)

    return parsedItems.length ? parsedItems : null
  }
}

const normalizePosition = (position: PositionList): PositionList => ({
  ...position,
  is_single_holder: Boolean(position.is_single_holder),
  max_holder: position.max_holder ?? null,
  allowed_unit_types: parseAllowedUnitTypes(position.allowed_unit_types),
})

const normalizePositionResponse = (response: ResponseType<PositionList[]>): ResponseType<PositionList[]> => ({
  ...response,
  data: response.data?.map(normalizePosition) ?? [],
})

const normalizePositionDetailResponse = (response: ResponseType<PositionList>): ResponseType<PositionList> => ({
  ...response,
  data: response.data ? normalizePosition(response.data) : response.data,
})

const serializePositionPayload = (data: PositionValues): Omit<PositionList, 'id'> => ({
  code: data.code,
  name: data.name,
  is_single_holder: Boolean(data.is_single_holder),
  max_holder: data.max_holder ?? null,
  allowed_unit_types: data.allowed_unit_types?.length ? data.allowed_unit_types : null,
})

export const getPosition = async (pageQuery: PageQueryType): Promise<ResponseType<PositionList[]>> => {
  const response = await axiosInstance.get(`/positions`, {
    params: pageQuery,
  })
  return normalizePositionResponse(response.data)
}

export const getPositionAsOptions = async (): Promise<ResponseType<PositionOption[]>> => {
  const response = await axiosInstance.get(`/positions/options`)
  return response.data
}

export const getPositionById = async (id: string): Promise<ResponseType<PositionList>> => {
  const response = await axiosInstance.get(`/positions/${id}`)
  return normalizePositionDetailResponse(response.data)
}

export const addPosition = async (data: PositionValues): Promise<ResponseType<null>> => {
  const response = await axiosInstance.post(`/positions`, serializePositionPayload(data))
  return response.data
}

export const updatePosition = async (id: string, data: PositionValues): Promise<ResponseType<null>> => {
  const response = await axiosInstance.put(`/positions/${id}`, serializePositionPayload(data))
  return response.data
}

export const deletePosition = async (id: string): Promise<ResponseType<null>> => {
  const response = await axiosInstance.delete(`/positions/${id}`)
  return response.data
}
