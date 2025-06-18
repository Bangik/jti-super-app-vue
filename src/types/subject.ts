export type SubjectList = {
  id: string
  code: string
  name: string
  study_program_name: string
  study_program_id: string
  status: 'ACTIVE' | 'INACTIVE'
}

export type SubjectOption = {
  value: string
  label: string
}
