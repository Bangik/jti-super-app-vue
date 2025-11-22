export type MajorList = {
  id: string
  code: string
  name: string
  org_unit_id: string
  head: {
    id: string
    name: string
    email: string
  }
}

export type MajorOption = {
  value: string
  label: string
}
