'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


const BloodDoner=use('App/Models/BloodDoner');
const MedicalAppointMent=use('App/Models/MedicalAppointment');
const ScoreQuiz=use('App/Models/ScoreQuiz');
const UserData=use('App/Models/UserDatum');
const Database = use('Database');
const TwoStep=use('App/Models/TwoStep');
const Administrator=use('App/Models/Administrator');
const Hash = use('Hash');
const nodemailer = require('nodemailer');

class TwostepController {
  
  async index ({ request, response, view }) {
  }

  async create ({ request, response, view }) {
    const twoStep=new TwoStep();
    const data=request.all();
    twoStep.id_administrator=data.id_administrator;
    var max=5000;
    var min=1000;
    var numero=Math.floor(Math.random() * (max - min)) + min;
    twoStep.number=numero;
    await twoStep.save();
    return response.json({twoStep});
  }

  async store ({ request, response ,auth}) {

  }

  async show ({ params, request, response, view }) {
  }

  async edit ({ params, request, response, view }) {
  }
  async update ({ params, request, response }) {
     const data=request.all();
     const admin=await Administrator.findByOrFail('id_blood_doner',data.id_doner);
     const twoStep=await TwoStep.findByOrFail('id_administrator',admin.id);     
     var max=5000;
     var min=1000;
     var numero=Math.floor(Math.random() * (max - min)) + min;
     twoStep.merge({ number:numero});
     await twoStep.save();
     this.SendEmail(data.email,numero);
     return response.json({twoStep});
  }

  async SendEmail(email,numero){
    var numero=numero;
    var email=email;
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '153224@ids.upchiapas.edu.mx',
        pass: 'leon1994'
      }
    });
    var mailOptions = {
      from:'153224@ids.upchiapas.edu.mx',
      to:email,
      subject:'codigo de verificacion',
      html:`<h1>codigo de verificacion ${numero}</h1>`,
    }; 
    transporter.sendMail(mailOptions, function(error, info){
      if (error){
        } else {
        }
    });
  } 

  async verificationCodigo({request,params,response,auth}){
    const user = await auth.getUser();
    const data=request.all();
    var numero=data.numero;
    var id_doner=data.id_doner;
    const administrator =await Administrator.findByOrFail('id_blood_doner',id_doner);
    const twoStep=await TwoStep.findByOrFail('id_administrator',administrator.id);

    if(twoStep.number==numero){
      return response.json({message:'autorizado'})
    }
    else{
      return response.json({message:'no autorizado'});
    }

  }
  
  async destroy ({ params, request, response }) {
  }



}

module.exports = TwostepController
