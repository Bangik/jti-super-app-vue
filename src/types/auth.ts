export type MeResponse = {
  id: string
  email: string
  name: string
  avatar_url: string
  roles: string[]
  permissions: string[]
}

export type LoginResponse = {
  token: string
  user: MeResponse
}

export type LoginStore = LoginResponse & {
  token: string
  server: string
}
