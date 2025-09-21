import { addPermissions, deletePermissions, getPermissions, updatePermissions } from '@/services/permission'
import type { PageQueryType, ResponseType } from '@/types'
import type { Permission } from '@/types/permission'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useMutationResources } from './toast-query-client'
import type { PermissionValues } from '@/constants/forms/permission'

export const useGetPermissions = (pageQuery: Ref<PageQueryType>) => {
  return useQuery<ResponseType<Permission[]>, Error>({
    queryKey: ['permissions', pageQuery],
    queryFn: () => getPermissions(pageQuery.value),
  })
}

export const useAddPermissions = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: addPermissions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      toast.success('Permission berhasil ditambahkan')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useUpdatePermissions = (id: Ref<string>) => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (data: PermissionValues) => updatePermissions(id.value, data),
    onMutate: async (updatedData: PermissionValues) => {
      await queryClient.cancelQueries({ queryKey: ['permissions', id] })
      return updatedData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      toast.success('Permission berhasil diperbarui')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useDeletePermissions = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: deletePermissions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      toast.success('Permission berhasil dihapus')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}
