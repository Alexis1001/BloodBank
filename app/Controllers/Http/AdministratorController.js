'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


const DataUser=use('App/Models/UserDatum');
const BloodDoner=use('App/Models/BloodDoner');
const Database = use('Database');
const User=use('App/Models/User');
const ScoreQuiz=use('App/Models/ScoreQuiz');

class MasterController {
  
  async indexDoners({ request, response,auth }) {
    const user = await auth.getUser();
    const user_data=await DataUser.findByOrFail('id_user',user.id);

    if(user_data.rol==2){
      const user_all =await Database.table('users')
      .innerJoin('user_data','users.id', 'user_data.id_user')
      .innerJoin('blood_doners','user_data.id','blood_doners.id_user_data')
      //.where('user_data.sex','hombre')
      .select('blood_doners.id','userName','UserFirtsName','UserLastName','rol','sex','movilPhone');
      return response.json({user_all});
    }

    else{
      return response.json({message:'you do not have administrator permissions'});
    }

  }

  async updateDoners({request,response,auth,params}){
    const user = await auth.getUser();
    const user_datas=await DataUser.findByOrFail('id_user',user.id);
    console.log("usario master "+user.id);
    console.log("usuario mastar datos "+user_datas.id);
    const id=params.id;
    const data=request.all();
    const doner= await BloodDoner.find(id);
    console.log("id donador "+doner.id);
    const user_data= await DataUser.findByOrFail('id',doner.id_user_data);
    console.log("user data "+user_data.id);

    if(user_datas.rol==2){
      console.log("entre en el if")
      user_data.merge({
        rol:data.rol,
      });
      user_data.save();
      return response.json({user_data});
    }
    else{
      return response.json({message:'you do not have administrator permissions'});
    }
    
  }

  async destroy ({ params,response,auth}) {
    const user = await auth.getUser();
    
    console.log("hola perro ");
    const user_datas=await DataUser.findByOrFail('id_user',user.id);
    console.log("usuario master "+user.id+" user name "+user.userName);
    console.log("usuario mastar datos "+user_datas.id+" user rol "+user_datas.rol);
    const id=params.id;
    const doner= await BloodDoner.find(id);
   
    return response.json({doner});
  }
  

  async create ({ request, response, view }) {
  }

  async store ({ request, response }) {
  }

 
  async show ({ params, request, response, view }) {
  }
  async edit ({ params, request, response, view }) {
  }  
  async update ({ params, request, response }) {
  }

  
}

module.exports = MasterController
