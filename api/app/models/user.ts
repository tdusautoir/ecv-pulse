import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Contact from './contact.js'
import Transaction from './transaction.js'

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

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
