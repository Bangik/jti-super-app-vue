import { addOrgUnit, deleteOrgUnit, getOrgUnit, getOrgUnitAsOptions, updateOrgUnit } from '@/services/org-unit'
import type { PageQueryType, ResponseType } from '@/types'
import type { OrgUnitList, OrgUnitOption } from '@/types/org-unit'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useMutationResources } from './toast-query-client'
import type { OrgUnitValues } from '@/constants/forms/org-unit'

export const useGetOrgUnit = (pageQuery: Ref<PageQueryType>) => {
  return useQuery<ResponseType<OrgUnitList[]>, Error>({
    queryKey: ['org-units', pageQuery],
    queryFn: () => getOrgUnit(pageQuery.value),
  })
}

export const useGetOrgUnitAsOptions = () => {
  return useQuery<ResponseType<OrgUnitOption[]>, Error>({
    queryKey: ['org-units', 'options'],
    queryFn: () => getOrgUnitAsOptions(),
  })
}

export const useAddOrgUnit = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: addOrgUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-units'] })
      toast.success('Unit organisasi berhasil ditambahkan')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useUpdateOrgUnit = (id: Ref<string>) => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: (data: OrgUnitValues) => updateOrgUnit(id.value, data),
    onMutate: async (updatedData: OrgUnitValues) => {
      await queryClient.cancelQueries({ queryKey: ['org-units', id] })
      return updatedData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-units'] })
      toast.success('Unit organisasi berhasil diperbarui')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}

export const useDeleteOrgUnit = () => {
  const { queryClient, toast } = useMutationResources()
  return useMutation({
    mutationFn: deleteOrgUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-units'] })
      toast.success('Unit organisasi berhasil dihapus')
    },
    onError: error => {
      toast.error(error.message)
    },
  })
}
