import type { SessionList } from './session'

export type SemesterList = {
  id: string
  year: string
  semester: string
  session: SessionList
}

export type FilterSemester = {
  session_id?: string
  year?: string
}

export type SemesterOptions = {
  id: string
  year: string
  semester: string
}
