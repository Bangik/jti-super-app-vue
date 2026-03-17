import { createSchedule, deleteSchedule, getSchedule, getSheduleById, updateSchedule, getWeeklySchedule } from '@/services/schedule'
import type { PageQueryType, ResponseType } from '@/types'
import type { ScheduleList, WeeklyDaySchedule, WeeklyScheduleFilter } from '@/types/schedule'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useMutationResources } from './toast-query-client'
import type { ScheduleValues } from '@/constants/forms/schedule'

export const useGetSchedule = (params: Ref<PageQueryType>) => {
  return useQuery<ResponseType<ScheduleList[]>, Error>({
    queryKey: ['schedules', params],
    queryFn: () => getSchedule(params.value),
  })
}

export const useGetScheduleById = (id: Ref<string>) => {
  return useQuery({
    queryKey: ['schedule', id],
    queryFn: () => getSheduleById(id.value),
    enabled: computed(() => !!id.value),
  })
}

export const useCreateSchedule = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (payload: ScheduleValues) => createSchedule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
      toast.success('Jadwal berhasil ditambahkan')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useUpdateSchedule = (id: Ref<string>) => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (data: ScheduleValues) => updateSchedule(id.value, data),
    onMutate: async (updatedData: ScheduleValues) => {
      await queryClient.cancelQueries({ queryKey: ['schedule', id] })
      return updatedData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
      toast.success('Jadwal berhasil diubah')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useDeleteSchedule = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (id: string) => deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
      toast.success('Jadwal berhasil dihapus')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useGetWeeklySchedule = (params: Ref<WeeklyScheduleFilter>) => {
  return useQuery<ResponseType<WeeklyDaySchedule[]>, Error>({
    queryKey: ['weekly-schedules', params],
    queryFn: () => getWeeklySchedule(params.value),
  })
}
