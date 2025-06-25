import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Contact from './contact.js'
import Transaction from './transaction.js'
import Budget from './budget.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email', 'phoneNumber'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column()
  declare phoneNumber: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare balance: number

  @column()
  declare level: number

  @column()
  declare xp: number

  @column()
  declare avatarUrl: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Contact, {
    foreignKey: 'userId',
  })
  declare contacts: HasMany<typeof Contact>

  @hasMany(() => Transaction, {
    foreignKey: 'senderId',
  })
  declare sentTransactions: HasMany<typeof Transaction>

  @hasMany(() => Transaction, {
    foreignKey: 'receiverId',
  })
  declare receivedTransactions: HasMany<typeof Transaction>

  @hasMany(() => Budget, {
    foreignKey: 'userId',
  })
  declare budgets: HasMany<typeof Budget>

  static accessTokens = DbAccessTokensProvider.forModel(User)

  /**
   * Get the total spent amount for the current month
   */
  async getCurrentMonthSpent(): Promise<number> {
    const now = DateTime.now()
    const startOfMonth = now.startOf('month')
    const endOfMonth = now.endOf('month')

    const result = await Transaction.query()
      .where('senderId', this.id)
      .andWhereBetween('createdAt', [startOfMonth.toSQL()!, endOfMonth.toSQL()!])
      .sum('amount as total')

    return Number(result[0].$extras.total) || 0
  }

  /**
   * Get spending by category for the current month
   */
  async getCurrentMonthSpendingByCategory(): Promise<Record<string, number>> {
    const now = DateTime.now()
    const startOfMonth = now.startOf('month')
    const endOfMonth = now.endOf('month')

    const transactions = await Transaction.query()
      .where('senderId', this.id)
      .andWhereNotNull('category')
      .andWhereBetween('createdAt', [startOfMonth.toSQL()!, endOfMonth.toSQL()!])

    const spendingByCategory: Record<string, number> = {}

    transactions.forEach((transaction) => {
      const category = transaction.category || 'other'
      spendingByCategory[category] =
        Number.parseFloat((spendingByCategory[category] || 0).toString()) +
        Number.parseFloat(transaction.amount.toString())
    })

    return spendingByCategory
  }

  /**
   * Get spending for a specific category in the current month
   */
  async getCurrentMonthSpendingForCategory(category: string): Promise<number> {
    const now = DateTime.now()
    const startOfMonth = now.startOf('month')
    const endOfMonth = now.endOf('month')

    const result = await Transaction.query()
      .where('senderId', this.id)
      .andWhere('category', category)
      .andWhereBetween('createdAt', [startOfMonth.toSQL()!, endOfMonth.toSQL()!])
      .sum('amount as total')

    return Number(result[0].$extras.total) || 0
  }
}
