export type StudyProgramList = {
  id: string
  code: string
  name: string
  major: {
    id: string
    name: string
  }
}

export type StudyProgramOption = {
  value: string
  label: string
}
