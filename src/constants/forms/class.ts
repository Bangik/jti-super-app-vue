import * as yup from 'yup'

export const ClassSchema = yup.object({
  study_program_id: yup.string().required('Program studi wajib diisi'),
  code: yup.string().required('Kode wajib diisi'),
  name: yup.string().required('Nama kelas wajib diisi'),
})

export type ClassValues = yup.InferType<typeof ClassSchema>
