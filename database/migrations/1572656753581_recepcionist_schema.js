'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RecepcionistSchema extends Schema {
  up () {
    this.create('recepcionists', (table) => {
      table.increments()
      table.integer('id_user_data').unsigned().references('id').inTable('user_data')
      table.timestamps()
    })
  }

  down () {
    this.drop('recepcionists')
  }
}

module.exports = RecepcionistSchema
