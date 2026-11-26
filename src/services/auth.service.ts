import { httpClient } from '@/api/http-client'
import type { LoginCredentials, AuthResponse, RefreshResponse } from '@/types/auth'
import type { User } from '@/types/user'

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>('/auth/login', credentials, { skipAuth: true })
  }

  async getMe(): Promise<User> {
    return httpClient.get<User>('/auth/me')
  }

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    return httpClient.post<RefreshResponse>(
      '/auth/refresh',
      { refreshToken, expiresInMins: 30 },
      { skipAuth: true },
    )
  }
}
