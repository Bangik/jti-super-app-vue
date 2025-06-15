import { addSemester, deleteSemester, getSemester, getSemesterOptions, updateSemester } from '@/services/semester'
import type { PageQueryType, ResponseType } from '@/types'
import type { SemesterList, SemesterOptions } from '@/types/semester'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useMutationResources } from './toast-query-client'
import type { SemesterValues } from '@/constants/forms/semester'

export const useGetSemester = (pageQuery: Ref<PageQueryType>) => {
  return useQuery<ResponseType<SemesterList[]>, Error>({
    queryKey: ['semesters', pageQuery],
    queryFn: () => getSemester(pageQuery.value),
  })
}

export const useGetSemesterAsOptions = (sessionId?: Ref<string>, enabled: Ref<boolean> = ref(true)) => {
  return useQuery<ResponseType<SemesterOptions[]>, Error>({
    queryKey: ['semesters', 'options', sessionId],
    queryFn: () => {
      return getSemesterOptions(sessionId?.value ?? '')
    },
    enabled,
  })
}

export const useAddSemester = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: addSemester,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] })
      toast.success('Semester berhasil ditambahkan')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useUpdateSemester = (id: Ref<string>) => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (data: SemesterValues) => updateSemester(id.value, data),
    onMutate: async (updatedData: SemesterValues) => {
      await queryClient.cancelQueries({ queryKey: ['semesters', id] })
      return updatedData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] })
      toast.success('Semester berhasil diperbarui')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useDeleteSemester = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (id: string) => deleteSemester(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] })
      toast.success('Semester berhasil dihapus')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}
