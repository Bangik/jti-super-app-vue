export type PageQueryType<T = Record<string, unknown>> = {
  search?: string
  sort?: string
  filter?: string
  page?: number
  per_page?: number
  last_page?: number
  total?: number
  first_item?: number
  last_item?: number
  order?: 'asc' | 'desc'
  additionalQuery?: T
  running?: number
}

export type ResponseType<T = Record<string, unknown>> = {
  status_code: number
  message: string
  meta?: PageQueryType
  data?: T
  dev?: string
}

export type SortItem = { key: string; order?: 'asc' | 'desc' }
