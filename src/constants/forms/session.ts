import * as yup from 'yup'

export const SessionSchema = yup.object({
  session: yup.string().required('Tahun ajaran wajib diisi'),
})

export type SessionValues = yup.InferType<typeof SessionSchema>
