'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const ScoreQuiz=use('App/Models/ScoreQuiz');
const UserData=use('App/Models/UserDatum');
const BloodDoner=use('App/Models/BloodDoner');
const Database = use('Database');

class ScoreQuizController {
 
  async index ({ request, response, view ,auth}) {
    const user = await auth.getUser();
    const score=await Database.table('users')
    .innerJoin('user_data',user.id,'user_data.id_user')
    .where('users.email',user.email)
    .innerJoin('blood_doners','user_data.id','blood_doners.id_user_data')
    .innerJoin('score_quizs','blood_doners.id','score_quizs.id_blood_doner')
    .select('blood_doners.id','userName','UserFirtsName','UserLastName','rol','sex','movilPhone','score'
    ,'score_quizs.created_at');
    return response.json({score})
  }

  async create ({ request, response, view }) {
  }

  async store ({ request, response ,auth}) {
    const user = await auth.getUser();
    const data=request.all();
    const user_data=await UserData.findByOrFail('id_user',user.id)
    

    if(data.score==null){
      response.json({message:'fields empty'});
    }
    
    if(user_data.rol==1){
      const userData=await UserData.findByOrFail('id_user',user.id);
      const doner= await BloodDoner.findByOrFail('id_user_data',userData.id);
      const scoreQuiz=new ScoreQuiz();
      scoreQuiz.score=data.score;
      scoreQuiz.id_blood_doner=doner.id;
      await scoreQuiz.save();    
      const donerC=({
        id:doner.id,
        userName:user.userName,
        userFirtsName:user.userFirtsName,
        userLastName:user.userLastName,
        sex:userData.sex,
        movil:userData.movilPhone,
        doner:doner.bloodType,
        score:scoreQuiz.score,
        date:scoreQuiz.created_at,
      });
      return response.json({donerC});
    }
    if(user_data.rol!=1){
      return response.json({message:'not autorized'});
    }

      
  }


  async show ({ params, request, response, view }) {
  }

  async edit ({ params, request, response, view }) {
  }

  async update ({ params, request, response }) {
  }

  async destroy ({ params, request, response }) {
  }
}

module.exports = ScoreQuizController
