'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserDatum extends Model {
    user() {
        return this.belongsTo('App/Models/User')
    }
    medico() {
        return this.hasOne('App/Models/Medico');
    }
    bloodDoner() {
        return this.hasOne('App/Models/BloodDoner');
    }
    administrator() {
        return this.hasOne('App/Models/Administrator');
    }
    recepcionist() {
        return this.hasOne('App/Models/Recepcionist');
    }
}

module.exports = UserDatum
