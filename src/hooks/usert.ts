import { getUser, updateRoles } from '@/services/user'
import type { PageQueryType, ResponseType } from '@/types'
import type { UserDetail } from '@/types/user'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useMutationResources } from './toast-query-client'

export const useGetUsers = (pageQuery: Ref<PageQueryType>) => {
  return useQuery<ResponseType<UserDetail[]>, Error>({
    queryKey: ['users', pageQuery],
    queryFn: () => getUser(pageQuery.value),
  })
}

export const useUpdateUserRoles = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (data: { id: string; roles: string[] }) => updateRoles(data.id, data.roles),
    onMutate: async (updatedRoles: { id: string; roles: string[] }) => {
      await queryClient.cancelQueries({ queryKey: ['users', updatedRoles.id] })
      return updatedRoles
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Peran pengguna berhasil diperbarui')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}
