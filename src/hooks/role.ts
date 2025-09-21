import { addRoles, deleteRoles, getRoles, updateRoles } from '@/services/role'
import type { PageQueryType, ResponseType } from '@/types'
import type { Role } from '@/types/role'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useMutationResources } from './toast-query-client'
import type { RoleValues } from '@/constants/forms/role'

export const useGetRoles = (pageQuery: Ref<PageQueryType>) => {
  return useQuery<ResponseType<Role[]>, Error>({
    queryKey: ['roles', pageQuery],
    queryFn: () => getRoles(pageQuery.value),
  })
}

export const useAddRoles = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: addRoles,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Role berhasil ditambahkan')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useUpdateRoles = (id: Ref<string>) => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (data: RoleValues) => updateRoles(id.value, data),
    onMutate: async (updatedData: RoleValues) => {
      await queryClient.cancelQueries({ queryKey: ['roles', id] })
      return updatedData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Role berhasil diperbarui')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useDeleteRoles = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: deleteRoles,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Role berhasil dihapus')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}
