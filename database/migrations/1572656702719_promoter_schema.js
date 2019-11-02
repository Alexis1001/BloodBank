'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PromoterSchema extends Schema {
  up () {
    this.create('promoters', (table) => {
      table.increments()
      table.integer('id_user_data').unsigned().references('id').inTable('user_data')
      table.timestamps()
    })
  }

  down () {
    this.drop('promoters')
  }
}

module.exports = PromoterSchema
