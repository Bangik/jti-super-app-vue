import axiosInstance from '@/lib/axiosInstance'
import type { PageQueryType, ResponseType } from '@/types'
import type { LaboratoryList } from '@/types/labs'

export async function getLaboratory(pageQuery: PageQueryType): Promise<ResponseType<LaboratoryList[]>> {
  const response = await axiosInstance.get('/labs', {
    params: { ...pageQuery },
  })
  return response.data
}
