import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LoginCredentials } from '@/types/auth'
import type { User } from '@/types/user'
import { ServiceProvider } from '@/services/service-provider'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const user = ref<User | null>(
    (() => {
      try {
        const saved = localStorage.getItem('authUser')
        return saved ? JSON.parse(saved) : null
      } catch {
        return null
      }
    })(),
  )
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!accessToken.value)

  function setTokens(newAccessToken: string, newRefreshToken: string) {
    accessToken.value = newAccessToken
    refreshToken.value = newRefreshToken
    localStorage.setItem('accessToken', newAccessToken)
    localStorage.setItem('refreshToken', newRefreshToken)
  }

  function setUser(newUser: User | null) {
    user.value = newUser
    if (newUser) {
      localStorage.setItem('authUser', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('authUser')
    }
  }

  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    error.value = null
    try {
      const response = await ServiceProvider.auth.login(credentials)
      setTokens(response.accessToken, response.refreshToken)

      const authUser: User = {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        gender: response.gender,
        image: response.image,
        age: 0,
        phone: '',
      }
      setUser(authUser)
      return response
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      error.value = message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('authUser')
  }

  async function fetchCurrentUser(): Promise<User | null> {
    if (!accessToken.value) return null
    try {
      const currentUser = await ServiceProvider.auth.getMe()
      setUser(currentUser)
      return currentUser
    } catch {
      return null
    }
  }

  async function refreshTokens(): Promise<boolean> {
    if (!refreshToken.value) {
      logout()
      return false
    }
    try {
      const data = await ServiceProvider.auth.refresh(refreshToken.value)
      setTokens(data.accessToken, data.refreshToken)
      return true
    } catch {
      logout()
      return false
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    fetchCurrentUser,
    refreshTokens,
    setUser,
  }
})
