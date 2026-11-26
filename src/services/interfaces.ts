export interface PaginationParams {
  limit?: number
  skip?: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

export interface Readable<T, TId = number> {
  getAll(params?: PaginationParams): Promise<PaginatedResult<T>>
  getById(id: TId): Promise<T>
}

export interface Creatable<T, TCreate> {
  create(data: TCreate): Promise<T>
}

export interface Editable<T, TUpdate, TId = number> {
  update(id: TId, data: TUpdate): Promise<T>
}

export interface Deletable<TId = number> {
  delete(id: TId): Promise<boolean | void>
}
