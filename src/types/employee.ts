import type { Gender, Religion, Status } from './user'

export type EmployeeList = {
  id: string
  user_id: string
  name: string
  email: string
  nip: string
  status: Status | undefined
  position: string
  avatar: string | null
}

export type EmployeeOption = {
  value: string
  label: string
}

export type EmployeeDetail = {
  id: string
  nip: string
  position: Position
  user: {
    id: string
    name: string
    email: string
    status: string
    gender: Gender | undefined
    religion: Religion | undefined
    birth_date: string | undefined
    birth_place: string | undefined
    phone_number: string | undefined
    address: string | undefined
    nationality: string | undefined
    avatar: string | null
  }
  major: {
    id: string | undefined
    name: string | null
  }
  study_program: {
    id: string | undefined
    name: string | null
  }
  created_at: string
  updated_at: string
}

export type SupervisorStudentList = {
  id: string
  user_id: string
  student_id: string
  name: string
  study_program_id: string
  study_program_name: string
  position: SupervisorPosition
}

export type Position = 'DOSEN' | 'TEKNISI' | 'ADMINISTRASI'
export type SupervisorPosition = 'ACADEMIC_ADVISOR' | 'SUPERVISOR_1' | 'SUPERVISOR_2' | 'SUPERVISOR_INTERNSHIP'
