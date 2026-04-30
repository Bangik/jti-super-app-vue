import { getGradeHistory, updateGradeById } from '@/services/grade'
import type { ResponseType } from '@/types'
import type { GradeHistoryData, GradeUpdatePayload } from '@/types/grade'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useMutationResources } from './toast-query-client'

export const useGetGradeHistory = (
  studentId: Ref<string>,
  semesterId: Ref<string>,
  enabled: Ref<boolean> = ref(true),
) => {
  return useQuery<ResponseType<GradeHistoryData>, Error>({
    queryKey: ['grades', 'history', studentId, semesterId],
    queryFn: () => getGradeHistory(studentId.value, semesterId.value),
    enabled,
  })
}

export const useUpdateGrade = () => {
  const { queryClient, toast } = useMutationResources()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: GradeUpdatePayload }) => updateGradeById(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades', 'history'] })
      toast.success('Nilai berhasil diperbarui')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}
