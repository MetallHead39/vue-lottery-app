import { UserService } from './user.service'
import { AuthService } from './auth.service'

export class ServiceProvider {
  private static _userService: UserService | null = null
  private static _authService: AuthService | null = null

  public static get users(): UserService {
    if (!this._userService) {
      this._userService = new UserService()
    }
    return this._userService
  }

  public static get auth(): AuthService {
    if (!this._authService) {
      this._authService = new AuthService()
    }
    return this._authService
  }
}
