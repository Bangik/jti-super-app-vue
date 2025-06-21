import type { Gender, Religion } from './user'

export type EmployeeList = {
  id: string
  name: string
  email: string
  nip: string
  avatar: string | null
}

export type EmployeeOption = {
  value: string
  label: string
}

export type EmployeeDetail = {
  id: string
  nip: string
  position: Position
  user: {
    id: string
    name: string
    email: string
    status: string
    gender: Gender | undefined
    religion: Religion | undefined
    birth_date: string | undefined
    birth_place: string | undefined
    phone_number: string | undefined
    address: string | undefined
    nationality: string | undefined
    avatar: string | null
  }
  major: {
    id: string | undefined
    name: string | null
  }
  created_at: string
  updated_at: string
}

export type Position = 'DOSEN' | 'TEKNISI' | 'ADMINISTRASI'
