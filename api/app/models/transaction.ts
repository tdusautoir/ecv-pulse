import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export type TransactionType = 'p2p' | 'group' | 'subscription' | 'deposit' | 'withdrawal' | 'saving'
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled'
export type TransactionCategory =
  | 'shopping'
  | 'video_games'
  | 'food'
  | 'bar'
  | 'transport'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'utilities'
  | 'other'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare senderId: number | null

  @column()
  declare receiverId: number | null

  @column()
  declare amount: number

  @column()
  declare type: TransactionType

  @column()
  declare category: TransactionCategory | null

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
}
