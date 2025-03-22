import { addClass, deleteClass, getClass, updateClass } from '@/services/class'
import type { PageQueryType, ResponseType } from '@/types'
import type { ClassList } from '@/types/class'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useMutationResources } from './toast-query-client'
import type { ClassValues } from '@/constants/forms/class'

export const useGetClass = (pageQuery: Ref<PageQueryType>, studyProgramId: string) => {
  return useQuery<ResponseType<ClassList[]>, Error>({
    queryKey: ['classes', pageQuery, studyProgramId],
    queryFn: () => getClass(pageQuery.value, studyProgramId),
  })
}

export const useAddClass = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: addClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
      toast.success('Kelas berhasil ditambahkan')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useUpdateClass = (id: Ref<string>) => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (data: ClassValues) => updateClass(id.value, data),
    onMutate: async (updatedData: ClassValues) => {
      await queryClient.cancelQueries({ queryKey: ['classes', id] })
      return updatedData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
      toast.success('Kelas berhasil diperbarui')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useDeleteClass = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
      toast.success('Kelas berhasil dihapus')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}
