import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import BudgetCategory from './budget_category.js'

export default class Budget extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare totalAmount: number

  @column()
  declare isActive: boolean

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @hasMany(() => BudgetCategory, {
    foreignKey: 'budgetId',
  })
  declare categories: HasMany<typeof BudgetCategory>

  /**
   * Get the remaining budget amount for current month
   */
  async getCurrentMonthRemaining(): Promise<number> {
    const spent = await this.user.getCurrentMonthSpent()
    return Math.max(this.totalAmount - spent, 0)
  }

  /**
   * Get the budget utilization percentage for current month
   */
  async getCurrentMonthUtilization(): Promise<number> {
    if (this.totalAmount === 0) return 0
    const spent = await this.user.getCurrentMonthSpent()
    return Math.min((spent / this.totalAmount) * 100, 100)
  }

  /**
   * Check if budget is exceeded for current month
   */
  async isCurrentMonthExceeded(): Promise<boolean> {
    const spent = await this.user.getCurrentMonthSpent()
    return spent > this.totalAmount
  }
}
