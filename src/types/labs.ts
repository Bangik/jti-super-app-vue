export type LaboratoryEmployee = {
  id: string
  name: string
  is_head_lab: boolean
  period: string | null
  status: string
}

export type LaboratoryMajor = {
  id: string
  name: string
}

export type LaboratoryList = {
  id: string
  code: string
  name: string
  major: LaboratoryMajor
  employees: LaboratoryEmployee[]
}
