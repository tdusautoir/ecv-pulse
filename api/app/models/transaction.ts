import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export type TransactionType = 'p2p' | 'group' | 'subscription' | 'deposit' | 'withdrawal'
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: number

  @column()
  declare senderId: number | null

  @column()
  declare receiverId: number | null

  @column()
  declare amount: number

  @column()
  declare type: TransactionType

  @column()
  declare status: TransactionStatus

  @column()
  declare description: string | null

  @column()
  declare message: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime()
  declare processedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
