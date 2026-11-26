interface RequestOptions extends RequestInit {
  skipAuth?: boolean
}

class HttpClient {
  private readonly baseUrl: string
  private isRefreshing = false
  private refreshSubscribers: Array<(token: string | null) => void> = []

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || ''
    if (!this.baseUrl) {
      console.warn('VITE_API_URL is not defined in environment variables')
    }
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('accessToken')
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken')
  }

  private setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }

  private clearTokensAndRedirect() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('authUser')
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
      const redirect = encodeURIComponent(window.location.pathname + window.location.search)
      window.location.href = `/login?redirect=${redirect}`
    }
  }

  private onTokenRefreshed(token: string | null) {
    this.refreshSubscribers.forEach((callback) => callback(token))
    this.refreshSubscribers = []
  }

  private addRefreshSubscriber(callback: (token: string | null) => void) {
    this.refreshSubscribers.push(callback)
  }

  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      this.clearTokensAndRedirect()
      return null
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken,
          expiresInMins: 30,
        }),
      })

      if (!response.ok) {
        throw new Error('Refresh failed')
      }

      const data = (await response.json()) as { accessToken: string; refreshToken: string }
      this.setTokens(data.accessToken, data.refreshToken)
      return data.accessToken
    } catch {
      this.clearTokensAndRedirect()
      return null
    }
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { skipAuth = false, headers = {}, ...rest } = options
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    }

    const token = this.getAccessToken()
    if (token && !skipAuth) {
      requestHeaders.Authorization = `Bearer ${token}`
    }

    const res = await fetch(url, {
      ...rest,
      headers: requestHeaders,
    })

    if (res.status === 401 && !skipAuth && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
      if (!this.isRefreshing) {
        this.isRefreshing = true
        const newToken = await this.refreshAccessToken()
        this.isRefreshing = false
        this.onTokenRefreshed(newToken)

        if (!newToken) {
          throw new Error('Unauthorized')
        }

        requestHeaders.Authorization = `Bearer ${newToken}`
        const retryRes = await fetch(url, {
          ...rest,
          headers: requestHeaders,
        })
        if (!retryRes.ok) {
          const errData = await retryRes.json().catch(() => ({}))
          throw new Error(errData.message || `Request failed with status ${retryRes.status}`)
        }
        return retryRes.json() as Promise<T>
      }

      return new Promise<T>((resolve, reject) => {
        this.addRefreshSubscriber(async (newToken) => {
          if (!newToken) {
            reject(new Error('Unauthorized'))
            return
          }
          requestHeaders.Authorization = `Bearer ${newToken}`
          try {
            const retryRes = await fetch(url, {
              ...rest,
              headers: requestHeaders,
            })
            if (!retryRes.ok) {
              const errData = await retryRes.json().catch(() => ({}))
              reject(new Error(errData.message || `Request failed with status ${retryRes.status}`))
              return
            }
            resolve(retryRes.json() as Promise<T>)
          } catch (err) {
            reject(err)
          }
        })
      })
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.message || `Request failed with status ${res.status}`)
    }

    // Handle empty responses
    if (res.status === 204) {
      return {} as T
    }

    return res.json() as Promise<T>
  }

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    })
  }

  put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    })
  }

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const httpClient = new HttpClient()
