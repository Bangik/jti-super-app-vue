import * as yup from 'yup'

export const RoleSchema = yup.object({
  name: yup.string().required('Nama role wajib diisi'),
})

export type RoleValues = yup.InferType<typeof RoleSchema>
