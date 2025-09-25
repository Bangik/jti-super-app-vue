import { type Permission } from '@/types/permission'

export type Role = {
  id: string
  name: string
  permissions: Permission[] | undefined
}

export type RoleOption = {
  value: string
  label: string
}
