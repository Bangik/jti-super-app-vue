import { addMajor, deleteMajor, getMajor, updateMajor } from '@/services/major'
import type { PageQueryType, ResponseType } from '@/types'
import type { MajorList } from '@/types/major'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useMutationResources } from './toast-query-client'
import type { MajorValues } from '@/constants/forms/major'

export const useGetMajor = (pageQuery: Ref<PageQueryType>) => {
  return useQuery<ResponseType<MajorList[]>, Error>({
    queryKey: ['majors', pageQuery],
    queryFn: () => getMajor(pageQuery.value),
  })
}

export const useAddMajor = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: addMajor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['majors'] })
      toast.success('Jurusan berhasil ditambahkan')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useUpdateMajor = (id: Ref<string>) => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (data: MajorValues) => updateMajor(id.value, data),
    onMutate: async (updatedData: MajorValues) => {
      await queryClient.cancelQueries({ queryKey: ['majors', id] })
      return updatedData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['majors'] })
      toast.success('Jurusan berhasil diperbarui')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useDeleteMajor = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: deleteMajor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['majors'] })
      toast.success('Jurusan berhasil dihapus')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}
