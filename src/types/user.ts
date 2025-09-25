import type { Role } from '@/types/role'

export type Gender = 'MALE' | 'FEMALE'
export type Religion = 'ISLAM' | 'CHRISTIANITY' | 'CATHOLIC' | 'HINDUISM' | 'BUDDHISM' | 'CONFUCIANISM' | 'OTHER'
export type Status = 'ACTIVE' | 'INACTIVE'

export type UserDetail = {
  id: string
  name: string
  email: string
  status: Status | undefined
  gender: Gender | undefined
  religion: Religion | undefined
  birth_date: string | undefined
  birth_place: string | undefined
  phone_number: string | undefined
  address: string | undefined
  nationality: string | undefined
  avatar: string | null
  roles: Role[]
}
