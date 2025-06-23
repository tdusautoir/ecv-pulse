import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Transaction from './transaction.js'

export default class SavingsObjective extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare name: string

  @column()
  declare targetAmount: number

  @column()
  declare currentAmount: number

  @column.date()
  declare targetDate: DateTime | null

  @column()
  declare description: string | null

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @hasMany(() => Transaction, {
    foreignKey: 'receiverId',
  })
  declare incomingTransactions: HasMany<typeof Transaction>

  @hasMany(() => Transaction, {
    foreignKey: 'senderId',
  })
  declare outgoingTransactions: HasMany<typeof Transaction>

  /**
   * Calculate the progress percentage
   */
  get progressPercentage(): number {
    if (this.targetAmount === 0) return 0
    return Math.min((this.currentAmount / this.targetAmount) * 100, 100)
  }

  /**
   * Check if the objective is completed
   */
  get isCompleted(): boolean {
    return this.currentAmount >= this.targetAmount
  }

  /**
   * Get remaining amount to reach target
   */
  get remainingAmount(): number {
    return Math.max(this.targetAmount - this.currentAmount, 0)
  }
}
