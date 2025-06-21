import {
  addSubject,
  deleteSubject,
  getLectureOnSubject,
  getSubject,
  getSubjectAsOptions,
  storeLectureOnSubject,
  updateSubject,
} from '@/services/subject'
import type { PageQueryType, ResponseType } from '@/types'
import type { LectureOnSubject, SelectedLectureData, SubjectList, SubjectOption } from '@/types/subject'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useMutationResources } from './toast-query-client'
import type { SubjectValues } from '@/constants/forms/subject'

export const useGetSubject = (pageQuery: Ref<PageQueryType>) => {
  return useQuery<ResponseType<SubjectList[]>, Error>({
    queryKey: ['subjects', pageQuery],
    queryFn: () => getSubject(pageQuery.value),
  })
}

export const useGetSubjectAsOptions = (
  studyProgramId?: Ref<string>,
  semesterId?: Ref<string>,
  enabled: Ref<boolean> = ref(true),
) => {
  return useQuery<ResponseType<SubjectOption[]>, Error>({
    queryKey: ['subjects', 'options', studyProgramId, semesterId],
    queryFn: () => getSubjectAsOptions(studyProgramId?.value ?? '', semesterId?.value ?? ''),
    enabled,
  })
}

export const useGetLectureOnSubject = (
  studyProgramId?: Ref<string>,
  semesterId?: Ref<string>,
  enabled: Ref<boolean> = ref(true),
) => {
  return useQuery<ResponseType<LectureOnSubject[]>, Error>({
    queryKey: ['subjects', 'lectures', studyProgramId, semesterId],
    queryFn: () => getLectureOnSubject(studyProgramId?.value ?? '', semesterId?.value ?? ''),
    enabled,
  })
}

export const useStoreLectureOnSubject = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (data: SelectedLectureData) => storeLectureOnSubject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects', 'lectures'] })
      toast.success('Dosen pengampu berhasil disimpan')
    },
    onError: error => {
      toast.error(error.message)
    },
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
