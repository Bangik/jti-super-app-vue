export type ScheduleList = {
  id: string
  semester_year: number
  semester_type: string
  semester_id: string
  session_id: string
  subject_semester_id: string
  subject_code: string
  subject_name: string
  room_name: string
  room_id: string
  study_program_name: string
  study_program_id: string
  semester_level: number
  class_group: string
  day_of_week: string
  start_time: string
  end_time: string
  user_id: string
  user_name: string
  employee_id: string
  user_email: string
}

export type FilterSchedule = {
  major_id?: string
  study_program_id?: string
  class_group?: string
  semester_id?: string
  employee_id?: string
}

export type WeeklyScheduleItem = {
  schedule_id: string
  subject_code: string
  subject_id: string
  subject_name: string
  room_id: string
  room_name: string
  study_program_id: string
  study_program_name: string
  semester_level: number
  class_group: string
  start_time: string
  end_time: string
  technician_id: string | null
  technician_name: string | null
  technician_email: string | null
}

export type WeeklyTimeSlot = {
  start_time: string
  end_time: string
  schedules: WeeklyScheduleItem[]
}

export type WeeklyDaySchedule = {
  day: string
  time_slots: WeeklyTimeSlot[]
}

export type WeeklyScheduleFilter = {
  semester_id?: string
  study_program_id?: string
  class_group?: string
  employee_id?: string
  search?: string
}
