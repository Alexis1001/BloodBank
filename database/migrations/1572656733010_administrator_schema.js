'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AdministratorSchema extends Schema {
  up () {
    this.create('administrators', (table) => {
      table.increments()
      table.integer('id_user_data').unsigned().references('id').inTable('user_data')
      table.timestamps()
    })
  }

  down () {
    this.drop('administrators')
  }
}

module.exports = AdministratorSchema
