import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, CreateUserDto, UpdateUserDto } from '@/types/user'
import { ServiceProvider } from '@/services/service-provider'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const total = ref<number>(0)
  const skip = ref<number>(0)
  const limit = ref<number>(10)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const searchQuery = ref<string>('')

  async function fetchUsers(params?: { page?: number; limit?: number; q?: string }) {
    isLoading.value = true
    error.value = null

    const take = params?.limit ?? limit.value
    const page = params?.page ?? 1
    const offset = (page - 1) * take
    const q = params?.q !== undefined ? params.q.trim() : searchQuery.value.trim()

    searchQuery.value = q
    limit.value = take
    skip.value = offset

    try {
      const result = q
        ? await ServiceProvider.users.search(q, { limit: take, skip: offset })
        : await ServiceProvider.users.getAll({ limit: take, skip: offset })

      users.value = result.items
      total.value = result.total
      skip.value = result.skip
      limit.value = result.limit
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch users'
    } finally {
      isLoading.value = false
    }
  }

  async function getUserById(id: number): Promise<User> {
    const existing = users.value.find((u) => u.id === id)
    if (existing) {
      return existing
    }
    return ServiceProvider.users.getById(id)
  }

  async function createUser(userData: CreateUserDto): Promise<User> {
    isLoading.value = true
    error.value = null
    try {
      const created = await ServiceProvider.users.create(userData)
      // DummyJSON returns an id (e.g. 209). Ensure id is unique and positive.
      const newId = created.id || Date.now()
      const newUser: User = { ...userData, ...created, id: newId }
      // Update local state since DummyJSON does not persist mutations
      users.value = [newUser, ...users.value]
      total.value += 1
      return newUser
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to create user'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateUser(id: number, userData: UpdateUserDto): Promise<User> {
    isLoading.value = true
    error.value = null
    try {
      const updated = await ServiceProvider.users.update(id, userData)
      // Update local state since DummyJSON does not persist mutations
      const index = users.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...userData, ...updated }
      }
      return updated
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to update user'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteUser(id: number): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      await ServiceProvider.users.delete(id)
      // Remove from local state
      users.value = users.value.filter((u) => u.id !== id)
      if (total.value > 0) {
        total.value -= 1
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to delete user'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    users,
    total,
    skip,
    limit,
    isLoading,
    error,
    searchQuery,
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  }
})
