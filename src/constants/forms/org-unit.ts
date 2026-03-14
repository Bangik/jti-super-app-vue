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

export const OrgUnitHeadSchema = yup.object({
  employee_id: yup.string().required('Pejabat unit organisasi wajib diisi'),
  position_id: yup.string().uuid().required('Jabatan wajib diisi'),
  started_at: yup.date().required('Tanggal mulai wajib diisi'),
  ended_at: yup.date().nullable(),
  decree_number: yup.string().nullable(),
  notes: yup.string().nullable(),
  is_acting: yup.boolean().nullable(),
})

export type OrgUnitHeadValues = yup.InferType<typeof OrgUnitHeadSchema>
