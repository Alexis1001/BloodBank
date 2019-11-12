'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ScoreQuiz extends Model {
    BloodDoner () {
        return this.belongsTo('App/Models/BloodDoner')
    }
}

module.exports = ScoreQuiz
