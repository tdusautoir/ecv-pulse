import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { loginUserValidator, registerUserValidator } from '#validators/users'
import { registerFakeCICUser } from '#utils/fakers/users'

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

  /**
   * Get current user information
   */
  async me({ auth }: HttpContext) {
    const user = auth.user!

    // Get additional user statistics
    const currentMonthSpent = await user.getCurrentMonthSpent()
    const currentMonthGain = await user.getCurrentMonthGain()
    const currentMonthGainSpentDiff = await user.getCurrentMonthGainSpentDiff()
    const spendingByCategory = await user.getCurrentMonthSpendingByCategory()

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      balance: user.balance,
      level: user.level,
      xp: user.xp,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      stats: {
        currentMonthSpent,
        currentMonthGain,
        currentMonthGainSpentDiff,
        spendingByCategory,
      },
    }
  }
}
