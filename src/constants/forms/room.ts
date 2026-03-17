import * as yup from 'yup'

export const RoomSchema = yup.object({
  code: yup.string().required('Kode wajib diisi'),
  name: yup.string().required('Nama wajib diisi'),
  capacity: yup.number().required('Kapasitas wajib diisi').min(1),
  type: yup.string().required('Tipe wajib dipilih'),
  org_unit_id: yup.string().nullable(),
  is_active: yup.boolean().default(true),
})

export type RoomValues = yup.InferType<typeof RoomSchema>
