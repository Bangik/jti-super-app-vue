import { addSession, deleteSession, getSession, getSessionAsOptions, updateSession } from '@/services/session'
import type { PageQueryType, ResponseType } from '@/types'
import type { SessionList } from '@/types/session'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useMutationResources } from './toast-query-client'

export const useGetSession = (pageQuery: Ref<PageQueryType>) => {
  return useQuery<ResponseType<SessionList[]>, Error>({
    queryKey: ['sessions', pageQuery],
    queryFn: () => getSession(pageQuery.value),
  })
}

export const useGetSessionAsOptions = () => {
  return useQuery<ResponseType<SessionList[]>, Error>({
    queryKey: ['sessions', 'options'],
    queryFn: () => getSessionAsOptions(),
  })
}

export const useAddSession = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: addSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      toast.success('Tahun ajaran berhasil ditambahkan')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useUpdateSession = (id: Ref<string>) => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (data: { session: string }) => updateSession(id.value, data),
    onMutate: async (updatedData: { session: string }) => {
      await queryClient.cancelQueries({ queryKey: ['sessions', id] })
      return updatedData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      toast.success('Tahun ajaran berhasil diperbarui')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useDeleteSession = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (id: string) => deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      toast.success('Tahun ajaran berhasil dihapus')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}
