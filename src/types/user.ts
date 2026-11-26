export interface UserAddress {
  address?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface User {
  id: number
  firstName: string
  lastName: string
  maidenName?: string
  age: number
  gender: 'male' | 'female' | 'other'
  email: string
  phone: string
  username: string
  password?: string
  birthDate?: string
  image?: string
  bloodGroup?: string
  height?: number
  weight?: number
  eyeColor?: string
  address?: UserAddress
  role?: string
}

export type CreateUserDto = Omit<User, 'id'>
export type UpdateUserDto = Partial<CreateUserDto>

export interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}
