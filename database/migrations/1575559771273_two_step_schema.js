'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TwoStepSchema extends Schema {
  up () {
    this.create('two_steps', (table) => {
      table.increments()
      table.integer('number')
      table.integer('id_administrator').unsigned().references('id').inTable('administrators')
      table.timestamps()
    })
  }

  down () {
    this.drop('two_steps')
  }
}

module.exports = TwoStepSchema
