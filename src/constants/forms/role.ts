import * as yup from 'yup'

export const RoleSchema = yup.object({
  name: yup.string().required('Nama role wajib diisi'),
  permissions: yup.array().of(yup.string()).min(1, 'Pilih minimal 1 permission'),
})

export type RoleValues = yup.InferType<typeof RoleSchema>
