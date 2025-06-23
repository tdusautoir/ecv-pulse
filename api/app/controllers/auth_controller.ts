import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { loginUserValidator, registerUserValidator } from '#validators/users'
import { registerFakeCICUser } from '../utils/users.js'

export default class AuthController {
  /**
   * Register a new user
   */
  async register({ request, response }: HttpContext) {
    const payload = await registerUserValidator.validate(request.all())
    const user = await registerFakeCICUser(payload)
    return response.created(user)
  }

  /**
   * Log a user in
   */
  async login({ request }: HttpContext) {
    const payload = await loginUserValidator.validate(request.all())

    const user = await User.verifyCredentials(
      (payload.email || payload.phoneNumber) as string,
      payload.password
    )

    const token = await User.accessTokens.create(user)

    return {
      type: 'bearer',
      value: token.value!.release(),
    }
  }
}
