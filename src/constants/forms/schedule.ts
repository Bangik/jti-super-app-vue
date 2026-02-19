import * as yup from 'yup'

export const ScheduleSchema = yup.object({
  semester_id: yup.string().uuid().required('Semester wajib dipilih'),
  subject_semester_id: yup.string().required('Mata kuliah wajib dipilih'),
  room_id: yup.string().uuid().required('Ruangan wajib dipilih'),
  study_program_id: yup.string().required('Program studi wajib dipilih'),
  semester_level: yup.number().min(1).required('Tingkat semester wajib diisi'),
  class_group: yup
    .string()
    .oneOf(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'])
    .required('Golongan wajib dipilih'),
  day_of_week: yup
    .string()
    .oneOf(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'])
    .required('Hari wajib dipilih'),
  start_time: yup.string().required('Waktu mulai wajib diisi'),
  end_time: yup.string().required('Waktu selesai wajib diisi'),
  employee_id: yup.string().uuid().nullable(),
})

export type ScheduleValues = yup.InferType<typeof ScheduleSchema>
