import { useMutation, useQuery } from '@tanstack/vue-query'
import { createRoom, deleteRoom, getRoomAsOptions, getRoomById, getRooms, updateRoom } from '@/services/room'
import type { PageQueryType, ResponseType } from '@/types'
import type { RoomValues } from '@/constants/forms/room'
import type { Room, RoomOption } from '@/types/room'
import { useMutationResources } from './toast-query-client'

export const useGetRooms = (params: Ref<PageQueryType>) => {
  return useQuery<ResponseType<Room[]>, Error>({
    queryKey: ['rooms', params],
    queryFn: () => getRooms(params.value),
  })
}

export const useGetRoomsOptions = () => {
  return useQuery<ResponseType<RoomOption[]>, Error>({
    queryKey: ['rooms', 'options'],
    queryFn: () => getRoomAsOptions(),
  })
}

export const useGetRoomById = (id: Ref<string>) => {
  return useQuery({
    queryKey: ['room', id],
    queryFn: () => getRoomById(id.value),
    enabled: computed(() => !!id.value),
  })
}

export const useCreateRoom = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (payload: RoomValues) => createRoom(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      toast.success('Ruangan berhasil ditambahkan')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}
export const useUpdateRoom = (id: Ref<string>) => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (data: RoomValues) => updateRoom(id.value, data),
    onMutate: async (updatedData: RoomValues) => {
      await queryClient.cancelQueries({ queryKey: ['room', id] })
      return updatedData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      toast.success('Ruangan berhasil diubah')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useDeleteRoom = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (id: string) => deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      toast.success('Ruangan berhasil dihapus')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}
