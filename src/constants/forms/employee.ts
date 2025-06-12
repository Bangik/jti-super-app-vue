import * as yup from 'yup'

export const EmployeeSchema = yup.object({
  m_major_id: yup.string().uuid().nullable(),
  nip: yup.string().required('NIP / NIK wajib diisi').max(255),
  name: yup.string().required('Nama lengkap wajib diisi').max(255),
  email: yup.string().required('Email wajib diisi').email().max(255),
  position: yup.string().required('Jabatan wajib diisi'),
  avatar: yup
    .mixed()
    .nullable()
    .test('fileType', 'Format gambar tidak valid (jpeg, png, jpg, gif, svg)', value => {
      if (!value) return true
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml']
      if (value instanceof File) {
        return allowedTypes.includes(value.type)
      }
      return false
    })
    .test('fileSize', 'Ukuran gambar maksimal 2MB', value => {
      if (!value) return true
      if (value instanceof File) {
        return value.size <= 2 * 1024 * 1024
      }
      return false
    }),
})

export type EmployeeValues = yup.InferType<typeof EmployeeSchema>
