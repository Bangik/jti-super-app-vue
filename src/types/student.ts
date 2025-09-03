import type { Gender, Religion, Status } from './user'

export type StudentList = {
  id: string
  nim: string
  name: string
  generation: string | null
  class: {
    id: string
    name: string
  }
  study_program: {
    id: string
    name: string
  }
  major: {
    id: string
    name: string
  }
  avatar: string | null | undefined
}

export type FilterStudent = {
  major_id?: string
  study_program_id?: string
  class?: string
  semester_id?: string
}

export type StudentDetail = {
  id: string
  nim: string
  generation: string
  class: string
  tuition_fee: string
  tuition_method: string
  major_id: string | null
  study_program_id: string | null
  user: {
    id: string
    name: string
    email: string
    status: Status | undefined
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
  semester: {
    id: string | undefined
    name: string | null
  }
  semesters: {
    id: string
    semester: string
    class: string
    year: string
    session: string
  }[]
  study_program: {
    id: string | undefined
    name: string | null
  }
  created_at: string
  updated_at: string
}
