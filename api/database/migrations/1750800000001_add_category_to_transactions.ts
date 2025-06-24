import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .enum('category', [
          'shopping',
          'video_games',
          'food',
          'bar',
          'transport',
          'entertainment',
          'health',
          'education',
          'utilities',
          'other',
        ])
        .nullable()
        .after('type')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('category')
    })
  }
}
