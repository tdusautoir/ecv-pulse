import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table
        .integer('sender_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .nullable()
      table
        .integer('receiver_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .nullable()

      table.decimal('amount', 14, 2).notNullable()

      table
        .enum('type', ['p2p', 'group', 'subscription', 'deposit', 'withdrawal', 'saving'])
        .notNullable()
      table.enum('status', ['pending', 'completed', 'failed', 'cancelled']).notNullable()

      table.text('description').nullable()
      table.text('message').nullable()
      table.timestamp('processed_at').nullable()
      table.timestamp('created_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
