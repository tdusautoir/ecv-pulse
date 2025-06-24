import { BaseSchema } from '@adonisjs/lucid/schema'
import { categories } from '../../constants.js'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('category', categories).nullable().after('type')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('category')
    })
  }
}
