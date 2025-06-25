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
