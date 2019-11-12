'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BloodDoner extends Model {
    
    ScoreQuiz() {
        return this.hasMany('App/Models/ScoreQuiz')
    }

    

}

module.exports = BloodDoner
