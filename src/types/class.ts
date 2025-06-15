export type ClassList = {
  id: string
  code: string
  name: string
  study_program: {
    id: string
    name: string
  }
  major: {
    id: string
    name: string
  }
}

export type ClassOption = {
  value: string
  label: string
}
