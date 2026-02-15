export type Room = {
  id: string
  lab_id: string | null
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
