import * as yup from 'yup'

export const StudyProgramSchema = yup.object({
  major_id: yup.string().required('Program studi wajib diisi'),
  code: yup.string().required('Kode wajib diisi'),
  name: yup.string().required('Nama jurusan wajib diisi'),
})

export type StudyProgramValues = yup.InferType<typeof StudyProgramSchema>
