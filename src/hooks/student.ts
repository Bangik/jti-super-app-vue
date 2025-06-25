import { getStudent } from '@/services/student'
import type { ResponseType, PageQueryType } from '@/types'
import type { StudentList } from '@/types/student'
import { useQuery } from '@tanstack/vue-query'

export const useGetStudent = (pageQuery: Ref<PageQueryType>) => {
  return useQuery<ResponseType<StudentList[]>, Error>({
    queryKey: ['students', pageQuery],
    queryFn: () => getStudent(pageQuery.value),
  })
}
