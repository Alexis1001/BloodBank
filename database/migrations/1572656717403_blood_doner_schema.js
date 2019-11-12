'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BloodDonerSchema extends Schema {
  up () {
    this.create('blood_doners', (table) => {
      table.increments()
      table.string('bloodType').notNullable()
      table.string('curp').notNullable();
      table.integer('id_user_data').unsigned().references('id').inTable('user_data')
      
      table.timestamps()
    })
  }

  down () {
    this.drop('blood_doners')
  }
}

module.exports = BloodDonerSchema
