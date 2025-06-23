import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { registerUserValidator } from '#validators/users'

export default class AuthController {
  /**
   * Register a new user
   */
  async register({ request, response }: HttpContext) {
    const payload = await registerUserValidator.validate(request.all())
    const user = await User.create(payload)
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
