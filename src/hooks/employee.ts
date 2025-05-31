import { deleteEmployee, getEmployee } from '@/services/employee'
import type { PageQueryType, ResponseType } from '@/types'
import type { EmployeeList } from '@/types/employee'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useMutationResources } from './toast-query-client'

export const useGetEmployee = (pageQuery: Ref<PageQueryType>) => {
  return useQuery<ResponseType<EmployeeList[]>, Error>({
    queryKey: ['employees', pageQuery],
    queryFn: () => getEmployee(pageQuery.value),
  })
}

export const useDeleteEmployee = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast.success('Karyawan berhasil dihapus')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}
