import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Budget from './budget.js'
import type { TransactionCategory } from './transaction.js'

export default class BudgetCategory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare budgetId: number

  @column()
  declare category: TransactionCategory

  @column()
  declare allocatedAmount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Budget, {
    foreignKey: 'budgetId',
  })
  declare budget: BelongsTo<typeof Budget>

  /**
   * Get the remaining amount for this category in current month
   */
  async getCurrentMonthRemaining(): Promise<number> {
    const spent = await this.budget.user.getCurrentMonthSpendingForCategory(this.category)
    return Math.max(this.allocatedAmount - spent, 0)
  }

  /**
   * Get the category utilization percentage for current month
   */
  async getCurrentMonthUtilization(): Promise<number> {
    if (this.allocatedAmount === 0) return 0
    const spent = await this.budget.user.getCurrentMonthSpendingForCategory(this.category)
    return Math.min((spent / this.allocatedAmount) * 100, 100)
  }

  /**
   * Check if category budget is exceeded for current month
   */
  async isCurrentMonthExceeded(): Promise<boolean> {
    const spent = await this.budget.user.getCurrentMonthSpendingForCategory(this.category)
    return spent > this.allocatedAmount
  }

  /**
   * Get the spent amount for this category in current month
   */
  async getCurrentMonthSpent(): Promise<number> {
    return await this.budget.user.getCurrentMonthSpendingForCategory(this.category)
  }
}
