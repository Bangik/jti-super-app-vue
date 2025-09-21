import * as yup from 'yup'

export const PermissionSchema = yup.object({
  name: yup.string().required('Nama permission wajib diisi'),
})

export type PermissionValues = yup.InferType<typeof PermissionSchema>
