import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import { createP2PTransactionValidator } from '../validators/transactions.js'
import db from '@adonisjs/lucid/services/db'
import { createP2PTransaction } from '../utils/transactions.js'
import { Exception } from '@adonisjs/core/exceptions'
import { DateTime } from 'luxon'

export default class TransactionsController {
  /**
   * Display a list of user's transactions
   */
  async index({ auth }: HttpContext) {
    const user = auth.user!
    const transactions = await Transaction.query()
      .where('senderId', user.id)
      .orWhere('receiverId', user.id)
      .orderBy('createdAt', 'desc')
      .preload('sender', (query) => {
        query.select(['id', 'fullName', 'phoneNumber'])
      })
      .preload('receiver', (query) => {
        query.select(['id', 'fullName', 'phoneNumber'])
      })

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
      .andWhere('senderId', user.id)
      .orWhere('receiverId', user.id)
      .firstOrFail()

    return transaction
  }

  /**
   * Get transactions grouped by category for the current month
   */
  async getTransactionsByCategory({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const month = request.input('month', DateTime.now().toFormat('yyyy-MM'))

    if (month === undefined) response.badRequest()

    const startOfMonth = DateTime.fromFormat(month, 'yyyy-MM').startOf('month')
    const endOfMonth = DateTime.fromFormat(month, 'yyyy-MM').endOf('month')

    const transactions = await Transaction.query()
      .where('senderId', user.id)
      .andWhereNotNull('category')
      .andWhereBetween('createdAt', [startOfMonth.toSQL()!, endOfMonth.toSQL()!])
      .orderBy('createdAt', 'desc')

    // Group by category and calculate totals
    const groupedTransactions = transactions.reduce(
      (acc, transaction) => {
        const category = transaction.category || 'other'
        if (!acc[category]) {
          acc[category] = {
            category,
            total: 0,
            count: 0,
            transactions: [],
          }
        }

        acc[category].total =
          Number.parseFloat(acc[category].total.toString()) +
          Number.parseFloat(transaction.amount.toString())
        acc[category].count += 1
        acc[category].transactions.push(transaction)

        return acc
      },
      {} as Record<string, { category: string; total: number; count: number; transactions: any[] }>
    )

    // Convert to array and sort by total
    const result = Object.values(groupedTransactions).sort((a, b) => b.total - a.total)

    return {
      month,
      totalSpent: result.reduce((sum, group) => sum + group.total, 0),
      categories: result,
    }
  }

  /**
   * Get all available categories
   */
  async getCategories() {
    const categories = [
      { id: 'shopping', name: 'Shopping', icon: '🛍️' },
      { id: 'video_games', name: 'Video Games', icon: '🎮' },
      { id: 'food', name: 'Food & Restaurants', icon: '🍕' },
      { id: 'bar', name: 'Bars & Nightlife', icon: '🍺' },
      { id: 'transport', name: 'Transport', icon: '🚇' },
      { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
      { id: 'health', name: 'Health & Fitness', icon: '💊' },
      { id: 'education', name: 'Education', icon: '📚' },
      { id: 'utilities', name: 'Utilities', icon: '⚡' },
      { id: 'other', name: 'Other', icon: '📦' },
    ]

    return categories
  }
}
