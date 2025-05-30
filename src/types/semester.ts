import type { SessionList } from './session'

export type SemesterList = {
  id: string
  year: string
  semester: string
  session: SessionList
}
