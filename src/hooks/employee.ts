import {
  addEmployee,
  deleteEmployee,
  getEmployee,
  getEmployeeAsOptions,
  getEmployeeById,
  updateEmployee,
} from '@/services/employee'
import type { PageQueryType, ResponseType } from '@/types'
import type { EmployeeDetail, EmployeeList, EmployeeOption, Position } from '@/types/employee'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useMutationResources } from './toast-query-client'
import type { EmployeeValues } from '@/constants/forms/employee'

export const useGetEmployee = (pageQuery: Ref<PageQueryType>) => {
  return useQuery<ResponseType<EmployeeList[]>, Error>({
    queryKey: ['employees', pageQuery],
    queryFn: () => getEmployee(pageQuery.value),
  })
}

export const useGetEmployeeAsOptions = (
  majorId?: Ref<string>,
  position?: Ref<Position>,
  enabled: Ref<boolean> = ref(true),
) => {
  return useQuery<ResponseType<EmployeeOption[]>, Error>({
    queryKey: ['employees', 'options', majorId, position],
    queryFn: () => getEmployeeAsOptions(majorId?.value ?? '', position?.value ?? ('' as Position)),
    enabled,
  })
}

export const useGetEmployeeById = (id: Ref<string>) => {
  return useQuery<ResponseType<EmployeeDetail>, Error>({
    queryKey: ['employees', id],
    queryFn: () => getEmployeeById(id.value),
  })
}

export const useAddEmployee = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast.success('Karyawan berhasil ditambahkan')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useUpdateEmployee = (id: Ref<string>) => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (data: EmployeeValues) => updateEmployee(id.value, data),
    onMutate: async (updatedData: EmployeeValues) => {
      await queryClient.cancelQueries({ queryKey: ['employees', id] })
      return updatedData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast.success('Karyawan berhasil diperbarui')
    },
    onError: error => {
      toast.error(error.message)
    },
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
