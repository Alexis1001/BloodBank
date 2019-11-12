'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MedicalAppointmentSchema extends Schema {
  up () {
    this.create('medical_appointments', (table) => {
      table.increments()
      table.time('time').notNullable()
      table.date('date').notNullable()
      table.string('status').notNullable()
      table.integer('id_blood_doner').unsigned().references('id').inTable('blood_doners')
      table.timestamps()
    })
  }

  down () {
    this.drop('medical_appointments')
  }
}

module.exports = MedicalAppointmentSchema
