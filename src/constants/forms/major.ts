import * as yup from 'yup'

export const MajorSchema = yup.object({
  code: yup.string().required('Kode wajib diisi'),
  name: yup.string().required('Nama jurusan wajib diisi'),
})

export type MajorValues = yup.InferType<typeof MajorSchema>
