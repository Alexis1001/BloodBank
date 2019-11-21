'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImgenesSchema extends Schema {
  up () {
    this.create('imgenes', (table) => {
      table.increments()
      table.string('image',250).notNullable()
      table.integer('id_promoter').unsigned().references('id').inTable('promoters')
      table.timestamps()
    })
  }

  down () {
    this.drop('imgenes')
  }
}

module.exports = ImgenesSchema
