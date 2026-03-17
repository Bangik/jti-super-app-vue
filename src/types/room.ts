export type Room = {
  id: string
  org_unit_id: string | null
  lab_name?: string | null
  code: string
  name: string
  capacity: number
  type: 'LAB' | 'WORKSHOP' | 'CLASS' | 'AUDITORIUM'
  is_active: boolean
}

export type RoomOption = {
  value: string
  label: string
}
