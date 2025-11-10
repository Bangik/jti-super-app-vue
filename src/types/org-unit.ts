export type OrgUnitType = 'UNIVERSITY' | 'DIRECTORATE' | 'MAJOR' | 'STUDY_PROGRAM' | 'LAB' | 'TEFA'

export type OrgUnitList = {
  id: string
  code: string
  name: string
  unit_type: OrgUnitType
  parent: OrgUnitOption | null
}

export type OrgUnitOption = {
  value: string
  label: string
}
