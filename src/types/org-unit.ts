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

export type HistoryHeadUser = {
  id: string
  name: string
  email: string
}

export type HistoryHeadPosition = {
  id: string
  name: string
  code: string
}

export type HistoryHead = {
  id: string
  user: HistoryHeadUser
  position: HistoryHeadPosition
  started_at: string
  ended_at: string | null
  is_active: boolean
  is_acting: boolean
  decree_number: string | null
  notes: string | null
}
