'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const BloodDoner=use('App/Models/BloodDoner');
const MedicalAppointMent=use('App/Models/MedicalAppointment');
const ScoreQuiz=use('App/Models/ScoreQuiz');
const UserData=use('App/Models/UserDatum');

class MedicalAppointMentController {
 
  async index ({ request, response, view, auth }) {
    const user =await auth.getUser(); 
    const medicalappointments=await MedicalAppointMent.all();
    return response.json({medicalappointments});
  }

  
  async create ({ request, response, view }) {
  }

  async store ({ request, response ,auth }) {
    const user = await auth.getUser();
    const data=request.all();
    console.log("generando cita");
    const appointMent =new MedicalAppointMent();
    const userData=await UserData.findByOrFail("id_user",user.id);
    const doner= await BloodDoner.findByOrFail('id_user_data',userData.id);
    appointMent.time=data.time;
    appointMent.date=data.date;
    appointMent.status="falso";
    appointMent.id_blood_doner=doner.id;

    if(data.time==null||data.date==null){
      return response.json({message:'fields empty'});
    }
    else{
      await appointMent.save();
      return response.json({doner,appointMent,user});  
    }
    
  }

  async show ({ params, request, response, view }) {
  }

  
  async edit ({ params, request, response, view }) {
  }

  
  async update ({ params, request, response,auth }) {
    const user= await auth.getUser();
    const id=params.id;
    const data=request.all();
    const appoint_Ment= await MedicalAppointMent.find(id);
    if(appoint_Ment){
      if(data.time==null&&data.date!=null){
        appoint_Ment.merge({
        date:data.date,
        });
        await appoint_Ment.save();
        return response.json({appoint_Ment});
      }
      if(data.time!=null&&data.date==null){
        appoint_Ment.merge({
          time:data.time,
        });
        await appoint_Ment.save();
        return response.json({appoint_Ment});
      }

    }

    else{
      return response.json({error:'not exist product'});       
    }

  }

  async destroy ({ params, request, response ,auth}) {
    const user=await auth.getUser();
    const id=params.id;
    const medicalAppointMent= await MedicalAppointMent.find(id);
    console.log(medicalAppointMent.time+" "+medicalAppointMent.date);
    if(medicalAppointMent){
      await medicalAppointMent.delete();
      return response.json({medicalAppointMent});
    }else{
      return response.json({message:'medical appint ment not exist'});
    }
    
  
  }
  
}

module.exports = MedicalAppointMentController
