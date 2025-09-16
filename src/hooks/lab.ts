import { getLaboratory } from '@/services/lab'
import type { PageQueryType, ResponseType } from '@/types'
import type { LaboratoryList } from '@/types/labs'
import { useQuery } from '@tanstack/vue-query'

export const useGetLab = (pageQuery: Ref<PageQueryType>) => {
  return useQuery<ResponseType<LaboratoryList[]>, Error>({
    queryKey: ['laboratories', pageQuery],
    queryFn: () => getLaboratory(pageQuery.value),
  })
}
