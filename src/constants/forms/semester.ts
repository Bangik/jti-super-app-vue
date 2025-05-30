import * as yup from 'yup'

export const SemesterSchema = yup.object({
  session_id: yup.string().required('Tahun ajaran wajib diisi'),
  year: yup.string().required('Tahun wajib diisi'),
  semester: yup.string().required('Semester wajib diisi'),
})

export type SemesterValues = yup.InferType<typeof SemesterSchema>
