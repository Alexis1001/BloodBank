'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ScoreQuizSchema extends Schema {
  up () {
    this.create('score_quizs', (table) => {
      table.increments()
      table.integer('score').notNullable()
      table.integer('id_blood_doner').unsigned().references('id').inTable('blood_doners')
      table.timestamps()
    })
  }

  down () {
    this.drop('score_quizs')
  }
}

module.exports = ScoreQuizSchema
