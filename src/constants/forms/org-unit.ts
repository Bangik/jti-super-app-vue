import type { OrgUnitType } from '@/types/org-unit'
import * as yup from 'yup'
import { ORG_UNIT_TYPE_VALUES } from '@/constants/org-unit'

export const OrgUnitSchema = yup.object({
  name: yup.string().required('Nama unit organisasi wajib diisi'),
  code: yup.string().required('Kode unit organisasi wajib diisi'),
  unit_type: yup
    .mixed<OrgUnitType>()
    .oneOf(ORG_UNIT_TYPE_VALUES as readonly OrgUnitType[], 'Tipe unit organisasi tidak valid')
    .required('Tipe unit organisasi wajib diisi'),
  parent_id: yup.string().nullable(),
})

export type OrgUnitValues = yup.InferType<typeof OrgUnitSchema>
