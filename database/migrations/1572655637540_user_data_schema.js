'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserDataSchema extends Schema {
  up () {
    this.create('user_data', (table) => {
      table.increments()
      table.string('sex').notNullable()
      table.string('movilPhone').notNullable().unique()
      table.date('dateBirth').notNullable()
      table.boolean('status').notNullable()
      table.integer('rol').notNullable()
      table.integer('id_user').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('user_data')
  }
}

module.exports = UserDataSchema
