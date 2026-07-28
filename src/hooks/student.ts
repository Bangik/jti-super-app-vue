import { addStudent, getStudent, getStudentAsOptions, getStudentById, syncPolijeStudents, getStudentSyncStatus, updateStudent } from '@/services/student'
import type { ResponseType, PageQueryType } from '@/types'
import type { StudentDetail, StudentList, StudentOptions, SyncJobStatusResponse } from '@/types/student'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useMutationResources } from './toast-query-client'
import type { StudentUpdateValues } from '@/constants/forms/student'

export const useGetStudentSyncStatus = (jobId?: Ref<string | undefined>, enabled: Ref<boolean> = ref(true)) => {
  return useQuery<ResponseType<SyncJobStatusResponse>, Error>({
    queryKey: ['students', 'sync-status', jobId],
    queryFn: () => getStudentSyncStatus(jobId?.value),
    enabled,
    retry: false, // Don't retry if job not found
    refetchInterval: (query) => {
      const data = query.state.data
      if (data?.data && (data.data.status === 'processing' || data.data.status === 'pending')) {
        return 3000
      }
      return false
    },
  })
}

export const useSyncPolijeStudents = (onSuccessCallback?: (data: ResponseType) => void) => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: ({ majorId, studyProgramId }: { majorId: string; studyProgramId: string }) =>
      syncPolijeStudents(majorId, studyProgramId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('Sync mahasiswa Polije berhasil dijalankan di background')
      if (onSuccessCallback) {
        onSuccessCallback(data)
      }
    },
    onError: error => {
      toast.error(error.message || 'Gagal sinkronisasi mahasiswa Polije')
    },
  })
}

export const useGetStudent = (pageQuery: Ref<PageQueryType>) => {
  return useQuery<ResponseType<StudentList[]>, Error>({
    queryKey: ['students', pageQuery],
    queryFn: () => getStudent(pageQuery.value),
  })
}

export const useGetStudentAsOptions = (
  majorId?: Ref<string>,
  studyProgramId?: Ref<string>,
  enabled: Ref<boolean> = ref(true),
) => {
  return useQuery<ResponseType<StudentOptions[]>, Error>({
    queryKey: ['students', 'options', majorId, studyProgramId],
    queryFn: () => getStudentAsOptions(majorId?.value ?? '', studyProgramId?.value ?? ''),
    enabled,
  })
}

export const useAddStudent = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: addStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('Mahasiswa berhasil ditambahkan')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useUpdateStudent = (id: Ref<string>) => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (data: StudentUpdateValues) => updateStudent(id.value, data),
    onMutate: async (updatedData: StudentUpdateValues) => {
      await queryClient.cancelQueries({ queryKey: ['students', id] })
      return updatedData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('Mahasiswa berhasil diperbarui')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useGetStudentById = (id: Ref<string>) => {
  return useQuery<ResponseType<StudentDetail>, Error>({
    queryKey: ['students', id],
    queryFn: () => getStudentById(id.value),
    enabled: !!id.value,
  })
}
