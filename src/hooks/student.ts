import { addStudent, getStudent, getStudentAsOptions, getStudentById, updateStudent } from '@/services/student'
import type { ResponseType, PageQueryType } from '@/types'
import type { StudentDetail, StudentList, StudentOptions } from '@/types/student'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useMutationResources } from './toast-query-client'
import type { StudentUpdateValues } from '@/constants/forms/student'

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
