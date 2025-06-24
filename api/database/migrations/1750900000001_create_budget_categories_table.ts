import { BaseSchema } from '@adonisjs/lucid/schema'
import { categories } from '../../constants.js'

export default class extends BaseSchema {
  protected tableName = 'budget_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('budget_id').unsigned().references('id').inTable('budgets').onDelete('CASCADE')
      table.enum('category', categories).notNullable()
      table.decimal('allocated_amount', 14, 2).notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Ensure one category allocation per budget
      table.unique(['budget_id', 'category'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
