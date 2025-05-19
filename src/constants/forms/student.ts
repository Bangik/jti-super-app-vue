import * as yup from 'yup'

export const StudentSchema = yup.object({
  class_id: yup.string().required('Kelas wajib diisi'),
  nim: yup.string().required('NIM wajib diisi'),
  generation: yup.string().nullable(),
  tuition_fee: yup.number().nullable(),
  tuition_method: yup.string().nullable(),
  name: yup.string().required('Nama mahasiswa wajib diisi'),
})

export type StudentValues = yup.InferType<typeof StudentSchema>
