'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MedicoSchema extends Schema {
  up () {
    this.create('medicos', (table) => {
      table.increments()
      table.string('speciality').notNullable()
      table.integer('id_user_data').unsigned().references('id').inTable('user_data')
      table.timestamps()
    })
  }

  down () {
    this.drop('medicos')
  }
}

module.exports = MedicoSchema
