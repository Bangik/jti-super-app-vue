import * as yup from 'yup'

export const StudentSchema = yup.object({
  name: yup.string().required('Nama mahasiswa wajib diisi'),
  email: yup.string().email('Email tidak valid').required('Email wajib diisi'),
  nim: yup.string().required('NIM wajib diisi'),
  generation: yup.string().nullable(),
  gender: yup.string().nullable(),
  religion: yup.string().nullable(),
  birth_place: yup.string().nullable().max(100),
  birth_date: yup.date().nullable(),
  tuition_fee: yup.string().nullable(),
  tuition_method: yup.string().nullable(),
  address: yup.string().nullable().max(255),
  phone_number: yup.string().nullable().max(20),
  nationality: yup.string().nullable().max(255),
  class: yup.string().required('Kelas wajib diisi'),
  semester_id: yup.string().required('Semester wajib diisi'),
  study_program_id: yup.string().required('Program studi wajib diisi'),
  m_user_id: yup.string().nullable(),
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

export const StudentUpdateSchema = yup.object({
  name: yup.string().required('Nama mahasiswa wajib diisi'),
  email: yup.string().email('Email tidak valid').required('Email wajib diisi'),
  nim: yup.string().required('NIM wajib diisi'),
  generation: yup.string().nullable(),
  gender: yup.string().nullable(),
  religion: yup.string().nullable(),
  birth_place: yup.string().nullable().max(100),
  birth_date: yup.date().nullable(),
  tuition_fee: yup.string().nullable(),
  tuition_method: yup.string().nullable(),
  address: yup.string().nullable().max(255),
  phone_number: yup.string().nullable().max(20),
  nationality: yup.string().nullable().max(255),
  status: yup.string().nullable(),
  study_program_id: yup.string().required('Program studi wajib diisi'),
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

export type StudentValues = yup.InferType<typeof StudentSchema>
export type StudentUpdateValues = yup.InferType<typeof StudentUpdateSchema>
