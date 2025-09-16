import * as yup from 'yup'

export const LabSchema = yup.object({
  major_id: yup.string().required('Lab wajib diisi'),
  code: yup.string().required('Kode wajib diisi'),
  name: yup.string().required('Nama laboratorium wajib diisi'),
})

export type LabValues = yup.InferType<typeof LabSchema>
