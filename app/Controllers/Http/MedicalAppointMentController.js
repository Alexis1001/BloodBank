'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const BloodDoner=use('App/Models/BloodDoner');
const MedicalAppointMent=use('App/Models/MedicalAppointment');
const ScoreQuiz=use('App/Models/ScoreQuiz');
const UserData=use('App/Models/UserDatum');
const Database = use('Database');

class MedicalAppointMentController {
 
  async index ({ request, response, view, auth }) {
    const user =await auth.getUser(); 
    const medicalAppointMent =await Database.table('users')
    .innerJoin('user_data',user.id, 'user_data.id_user')
    .where('users.email',user.email)
    .innerJoin('blood_doners','user_data.id','blood_doners.id_user_data')
    .innerJoin('medical_appointments','blood_doners.id','medical_appointments.id_blood_doner')
    .select('medical_appointments.id','userName','UserFirtsName','UserLastName','sex','movilPhone','bloodType','date','time',
    'medical_appointments.status');
    return response.json({medicalAppointMent})
  }

  
  async create ({ request, response, view }) {
  }

  async store ({ request, response ,auth }) {
    const user = await auth.getUser();
    const data=request.all();
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
      /*var fecha = new Date(); //Fecha actual
      var mes = fecha.getMonth()+1; //obteniendo mes
      var dia = fecha.getDate(); //obteniendo dia
      var ano = fecha.getFullYear(); //obteniendo año
      var date=ano+"-"+mes+"-"+dia;
      console.log("fecha actual "+date);
      const cita =await Database.table('blood_doners') 
      .innerJoin('medical_appointments','blood_doners.id','medical_appointments.id_blood_doner')
      .where('medical_appointments.date',date)
      .andWhere('medical_appointments.id_blood_doner',doner.id)
      .select('*');
      console.log("cita"+cita)*/
  
      await appointMent.save();
        const doner_cita=({
          Name:user.userName,
          FirstName:user.userFirtsName,
          LastName:user.userLastName,
          sex:userData.sex,
          movil:userData.movilPhone,
          blood:doner.bloodType,
          date:appointMent.date,
          time:appointMent.time,
          });
        return response.json({doner_cita});
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

      if(data.time!=null&&data.date!=null){
        appoint_Ment.merge({
          time:data.time,
          date:data.date,
        });
        await appoint_Ment.save();
        return response.json({appoint_Ment});
      }

    }

    else{
      return response.json({error:'not exist Medical Appoinment'});       
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

  async lastApointment({response,auth,request}){
    const user=await auth.getUser();
    var fecha = new Date(); //Fecha actual
    var mes = fecha.getMonth()+1; //obteniendo mes
    var dia = fecha.getDate(); //obteniendo dia
    var ano = fecha.getFullYear(); //obteniendo año
    var date=ano+"-"+mes+"-"+dia;
    console.log("fecha actual "+date);
    
    const medicalAppointMent =await Database.table('users')
    .innerJoin('user_data',user.id,'user_data.id_user')
    .where('users.email',user.email)
    .innerJoin('blood_doners','user_data.id','blood_doners.id_user_data')
    .innerJoin('medical_appointments','blood_doners.id','medical_appointments.id_blood_doner')
    .where('medical_appointments.date',date)
    .select('medical_appointments.id','userName','UserFirtsName','UserLastName','sex','movilPhone','bloodType','date','time',
    'medical_appointments.status');
    return response.json({medicalAppointMent});

  }
  
  
}

module.exports = MedicalAppointMentController
