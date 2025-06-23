import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  /**
   * Register a new user
   */
  async register({ request, response }: HttpContext) {
    const data = request.only(['email', 'password', 'fullName'])
    const user = await User.create(data)
    return response.created(user)
  }

  /**
   * Log a user in
   */
  async login({ request }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return {
      type: 'bearer',
      value: token.value!.release(),
    }
  }
}
