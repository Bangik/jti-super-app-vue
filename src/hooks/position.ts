import { addPosition, deletePosition, getPosition, getPositionAsOptions, updatePosition } from '@/services/position'
import type { PageQueryType, ResponseType } from '@/types'
import type { PositionList, PositionOption } from '@/types/position'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useMutationResources } from './toast-query-client'
import type { PositionValues } from '@/constants/forms/position'

export const useGetPosition = (pageQuery: Ref<PageQueryType>) => {
  return useQuery<ResponseType<PositionList[]>, Error>({
    queryKey: ['positions', pageQuery],
    queryFn: () => getPosition(pageQuery.value),
  })
}

export const useGetPositionAsOptions = () => {
  return useQuery<ResponseType<PositionOption[]>, Error>({
    queryKey: ['positions', 'options'],
    queryFn: () => getPositionAsOptions(),
  })
}

export const useAddPosition = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: addPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] })
      toast.success('Posisi berhasil ditambahkan')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useUpdatePosition = (id: Ref<string>) => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (data: PositionValues) => updatePosition(id.value, data),
    onMutate: async (updatedData: PositionValues) => {
      await queryClient.cancelQueries({ queryKey: ['positions', id] })
      return updatedData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] })
      toast.success('Posisi berhasil diperbarui')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useDeletePosition = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: deletePosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] })
      toast.success('Posisi berhasil dihapus')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}
