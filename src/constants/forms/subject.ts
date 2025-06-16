import * as yup from 'yup'

export const SubjectSchema = yup.object({
  study_program_id: yup.string().required('Program studi wajib diisi'),
  code: yup.string().required('Kode wajib diisi'),
  name: yup.string().required('Nama mata kuliah wajib diisi'),
  status: yup.string().nullable(),
})

export type SubjectValues = yup.InferType<typeof SubjectSchema>
