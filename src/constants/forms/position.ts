import * as yup from 'yup'

export const PositionSchema = yup.object({
  code: yup.string().required('Kode posisi wajib diisi'),
  name: yup.string().required('Nama posisi wajib diisi'),
})

export type PositionValues = yup.InferType<typeof PositionSchema>
