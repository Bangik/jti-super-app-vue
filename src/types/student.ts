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
