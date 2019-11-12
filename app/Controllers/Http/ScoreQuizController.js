'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const ScoreQuiz=use('App/Models/ScoreQuiz');
const UserData=use('App/Models/UserDatum');
const BloodDoner=use('App/Models/BloodDoner');

class ScoreQuizController {
 
  async index ({ request, response, view }) {
  }

  async create ({ request, response, view }) {
  }

  async store ({ request, response ,auth}) {
    const user = await auth.getUser();
    const data=request.all();
    
    if(data.score==null){
      response.json({message:'fields empty'});
    }
    else{
      const userData=await UserData.findByOrFail("id_user",user.id);
      if(userData.rol!=2){
        response.json({message:'not authorized'});
      }
      if(userData.rol==2){
        const doner= await BloodDoner.findByOrFail('id_user_data',userData.id);
        const scoreQuiz=new ScoreQuiz();
        scoreQuiz.score=data.score;
        scoreQuiz.id_blood_doner=doner.id;
        await scoreQuiz.save();    
        return response.json({scoreQuiz,doner,user});
      }
      
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
