import { httpClient } from '@/api/http-client'
import type {
  Readable,
  Creatable,
  Editable,
  Deletable,
  PaginationParams,
  PaginatedResult,
} from './interfaces'
import type { User, CreateUserDto, UpdateUserDto, UsersResponse } from '@/types/user'

export class UserService
  implements
    Readable<User, number>,
    Creatable<User, CreateUserDto>,
    Editable<User, UpdateUserDto, number>,
    Deletable<number>
{
  async getAll(params?: PaginationParams): Promise<PaginatedResult<User>> {
    const limit = params?.limit ?? 10
    const skip = params?.skip ?? 0
    const res = await httpClient.get<UsersResponse>(`/users?limit=${limit}&skip=${skip}`)
    return {
      items: res.users,
      total: res.total,
      skip: res.skip,
      limit: res.limit,
    }
  }

  async getById(id: number): Promise<User> {
    return httpClient.get<User>(`/users/${id}`)
  }

  async create(data: CreateUserDto): Promise<User> {
    return httpClient.post<User>('/users/add', data)
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    return httpClient.put<User>(`/users/${id}`, data)
  }

  async delete(id: number): Promise<boolean | void> {
    await httpClient.delete<{ isDeleted?: boolean; deletedOn?: string }>(`/users/${id}`)
    return true
  }

  async search(query: string, params?: PaginationParams): Promise<PaginatedResult<User>> {
    const limit = params?.limit ?? 10
    const skip = params?.skip ?? 0
    const encodedQ = encodeURIComponent(query.trim())
    const res = await httpClient.get<UsersResponse>(
      `/users/search?q=${encodedQ}&limit=${limit}&skip=${skip}`,
    )
    return {
      items: res.users,
      total: res.total,
      skip: res.skip,
      limit: res.limit,
    }
  }
}
