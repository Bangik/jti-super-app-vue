import { addOauthClient, deleteOAuthClient, getOAuthClients, updateOAuthClient } from '@/services/oauth'
import type { PageQueryType, ResponseType } from '@/types'
import type { OauthClient } from '@/types/oauth'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useMutationResources } from './toast-query-client'
import type { OauthClientValues } from '@/constants/forms/oauth'

export const useGetOauthClients = (pageQuery: Ref<PageQueryType>) => {
  return useQuery<ResponseType<OauthClient[]>, Error>({
    queryKey: ['oauthClients', pageQuery],
    queryFn: () => getOAuthClients(pageQuery.value),
  })
}

export const useAddOauthClient = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: addOauthClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oauthClients'] })
      toast.success('OAuth Client berhasil ditambahkan')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useUpdateOauthClient = (id: Ref<string>) => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (data: OauthClientValues) => updateOAuthClient(id.value, data),
    onMutate: async (updatedData: OauthClientValues) => {
      await queryClient.cancelQueries({ queryKey: ['oauthClients', id] })
      return updatedData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oauthClients'] })
      toast.success('OAuth Client berhasil diperbarui')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useDeleteOauthClient = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: deleteOAuthClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oauthClients'] })
      toast.success('OAuth Client berhasil dihapus')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}
