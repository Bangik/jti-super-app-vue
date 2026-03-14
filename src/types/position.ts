export type PositionList = {
  id: string
  code: string
  name: string
  is_single_holder: boolean
  max_holder: number | null
  allowed_unit_types: string[] | null
}

export type PositionOption = {
  value: string
  label: string
}
