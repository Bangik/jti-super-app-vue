import { addSubject, deleteSubject, getSubject, updateSubject } from '@/services/subject'
import type { PageQueryType, ResponseType } from '@/types'
import type { SubjectList } from '@/types/subject'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useMutationResources } from './toast-query-client'
import type { SubjectValues } from '@/constants/forms/subject'

export const useGetSubject = (pageQuery: Ref<PageQueryType>) => {
  return useQuery<ResponseType<SubjectList[]>, Error>({
    queryKey: ['subjects', pageQuery],
    queryFn: () => getSubject(pageQuery.value),
  })
}

export const useAddSubject = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: addSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      toast.success('Mata kuliah berhasil ditambahkan')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useUpdateSubject = (id: Ref<string>) => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (data: SubjectValues) => updateSubject(id.value, data),
    onMutate: async (updatedData: SubjectValues) => {
      await queryClient.cancelQueries({ queryKey: ['subjects', id] })
      return updatedData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      toast.success('Mata kuliah berhasil diperbarui')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useDeleteSubject = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (id: string) => deleteSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      toast.success('Mata kuliah berhasil dihapus')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}
