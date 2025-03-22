import { addStudyProgram, deleteStudyProgram, getStudyProgram, updateStudyProgram } from '@/services/study-program'
import type { PageQueryType, ResponseType } from '@/types'
import type { StudyProgramList } from '@/types/study-program'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useMutationResources } from './toast-query-client'
import type { StudyProgramValues } from '@/constants/forms/study-program'

export const useGetStudyProgram = (pageQuery: Ref<PageQueryType>, majorId: string) => {
  return useQuery<ResponseType<StudyProgramList[]>, Error>({
    queryKey: ['study-programs', pageQuery, majorId],
    queryFn: () => getStudyProgram(pageQuery.value, majorId),
  })
}

export const useAddStudyProgram = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: addStudyProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-programs'] })
      toast.success('Program Studi berhasil ditambahkan')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useUpdateStudyProgram = (id: Ref<string>) => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (data: StudyProgramValues) => updateStudyProgram(id.value, data),
    onMutate: async (updatedData: StudyProgramValues) => {
      await queryClient.cancelQueries({ queryKey: ['study-programs', id] })
      return updatedData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-programs'] })
      toast.success('Program Studi berhasil diperbarui')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useDeleteStudyProgram = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: deleteStudyProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-programs'] })
      toast.success('Program Studi berhasil dihapus')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}
