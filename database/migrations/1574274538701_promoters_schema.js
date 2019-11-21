'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PromotersSchema extends Schema {
  up () {
    this.create('promoters', (table) => {
      table.increments()
      table.string('title',255).notNullable()
      table.string('description',255).notNullable()
      table.string('image',255).notNullable()
      table.date('date').notNullable()
      table.integer('id_blood_doner').unsigned().references('id').inTable('blood_doners')
      table.timestamps()
    })
  }

  down () {
    this.drop('promoters')
  }
}

module.exports = PromotersSchema
