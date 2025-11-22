export type StudyProgramList = {
  id: string
  code: string
  name: string
  org_unit_id: string
  major: {
    id: string
    name: string
  }
  head: {
    id: string
    name: string
    email: string
  }
}

export type StudyProgramOption = {
  value: string
  label: string
}
