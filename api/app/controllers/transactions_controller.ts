import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import { createP2PTransactionValidator } from '../validators/transactions.js'
import db from '@adonisjs/lucid/services/db'
import { createP2PTransaction } from '../utils/transactions.js'
import { Exception } from '@adonisjs/core/exceptions'

export default class TransactionsController {
  /**
   * Display a list of user's transactions
   */
  async index({ auth }: HttpContext) {
    const user = auth.user!
    const transactions = await Transaction.query()
      .where('senderId', user.id)
      .orWhere('receiverId', user.id)

    return transactions
  }

  /**
   * Add a new transaction
   */
  async store({ request, response, auth }: HttpContext) {
    const sender = auth.user!

    const data = request.all()
    const payload = await createP2PTransactionValidator.validate(data)
    const trx = await db.transaction()

    try {
      const transaction = await createP2PTransaction(
        {
          senderId: sender.id,
          receiverId: payload.receiverId,
          amount: payload.amount,
          description: payload.description,
          message: payload.message,
        },
        trx
      )

      await trx.commit()
      return response.created(transaction)
    } catch (error) {
      await trx.rollback()

      if (error instanceof Exception) {
        return response.status(error.status).send({ message: error.message })
      }

      return response.internalServerError({ message: 'Transaction failed, please try again.' })
    }
  }

  /**
   * Show individual transaction
   */
  async show({ params, auth }: HttpContext) {
    const user = auth.user!

    const transaction = await Transaction.query()
      .where('id', params.id)
      .andWhere('userId', user.id)
      .firstOrFail()

    return transaction
  }
}
