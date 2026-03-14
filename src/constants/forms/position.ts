import * as yup from 'yup'
import { ORG_UNIT_TYPE_VALUES } from '@/constants/org-unit'

export const PositionSchema = yup.object({
  code: yup.string().required('Kode posisi wajib diisi'),
  name: yup.string().required('Nama posisi wajib diisi'),
  is_single_holder: yup.boolean().default(false),
  max_holder: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' || Number.isNaN(value) ? null : value))
    .nullable()
    .min(1, 'Maksimal pemegang minimal 1'),
  allowed_unit_types: yup
    .array()
    .of(yup.string().oneOf(ORG_UNIT_TYPE_VALUES, 'Tipe unit organisasi tidak valid').required())
    .nullable()
    .default(null),
})

export type PositionValues = yup.InferType<typeof PositionSchema>
