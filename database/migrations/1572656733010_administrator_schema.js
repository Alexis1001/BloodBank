'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AdministratorSchema extends Schema {
  up () {
    this.create('administrators', (table) => {
      table.increments()
      table.integer('id_blood_doner').unsigned().references('id').inTable('blood_doners')
      table.timestamps()
    })
  }

  down () {
    this.drop('administrators')
  }
}

module.exports = AdministratorSchema
