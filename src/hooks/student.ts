import { getStudent } from '@/services/student'
import type { ResponseType, PageQueryType } from '@/types'
import type { StudentList } from '@/types/student'
import { useQuery } from '@tanstack/vue-query'

export const useGetStudent = (pageQuery: Ref<PageQueryType>, classId?: string) => {
  return useQuery<ResponseType<StudentList[]>, Error>({
    queryKey: ['students', pageQuery, classId],
    queryFn: () => getStudent(pageQuery.value, classId),
  })
}
