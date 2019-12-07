'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const User=use('App/Models/User')
const UserData=use('App/Models/UserDatum')
const Doner=use('App/Models/BloodDoner')
const Promoter=use('App/Models/Promoter')
const Helpers = use('Helpers')
const Database = use('Database');

class PromoterController {
 
  async index ({ request, response,auth}) {
    const user = await auth.getUser();
    var fecha = new Date(); //Fecha actual
    var mes = fecha.getMonth()+1; //obteniendo mes
    var dia = fecha.getDate(); //obteniendo dia
    var ano = fecha.getFullYear(); //obteniendo año
    var date=ano+"-"+mes+"-"+dia;
    const promotions =await Database.table('promoters')
    .where('date',date)
    .select('*')
    return response.json({promotions});
  }

  async create ({ request, response,auth}) {
    const user = await auth.getUser();
    const userData=await UserData.findByOrFail('id_user',user.id);
    const doner=await Doner.findByOrFail('id_user_data',userData.id);
    const data = request.all();
    var fecha = new Date(); 
    var mes = fecha.getMonth()+1; 
    var dia = fecha.getDate(); 
    var ano = fecha.getFullYear(); 
    var date=ano+"-"+mes+"-"+dia;
    
    if(userData.rol!=4){
      return response.json({message:'Not authorized'});
    }
    else{
    const promotions=new Promoter();
    promotions.title=data.title;
    promotions.description=data.description;
    promotions.image=data.image;
    promotions.date=date;
    promotions.id_blood_doner=doner.id;
    
    var cadena=promotions.title.substring(0,3);

    const IMG = request.file('image')
    promotions.image=doner.curp+cadena+'.'+IMG.subtype

    await IMG.move(Helpers.publicPath('uploads/'),{
      name:promotions.image
    })

    promotions.image ='/uploads/'+promotions.image;

    await promotions.save();

    return response.json({promotions});

    }
  
  }

  async store ({ request,response,auth}) {  
  }

  async show ({ params, request, response, view }) {
  }

  async edit ({ params, request, response, view }) {
  }

  async update ({ params, request, response,auth}) {
    const user = await auth.getUser();
    const id =params.id;
    const promotions=await Promoter.find(id);
    const userData=await UserData.findByOrFail('id_user',user.id);
    const doner=await Doner.findByOrFail('id_user_data',userData.id);
    const data=request.all();
    if(userData.rol!=4){
      return response.json({message:'Not authorized'});
    }
    else{
      if(data.title==null&&data.description==null){
        return response.json({message:'emptys fields'});
      }
      if(data.description!=null&&data.title==null){
        var describe=data.description;
        promotions.merge({
          description:describe,
        });
        await promotions.save
        return response.json({promotions});
      }
      if(data.title!=null&&data.description==null){
        var tit=data.title;
        promotions.merge({
          title:tit,
        }); 
        await promotions.save();
        return response.json({promotions});
      }
      if(data.title!=null&&data.description!=null){
        var describe=data.description;
        var tit=data.title;
        promotions.merge({
          description:describe,
          title:tit,
        }); 
        await promotions.save();
        return response.json({promotions});
      }

    }

  }

  async destroy ({ params, request, response ,auth}) {
    const user = await auth.getUser();
    const id =params.id;
    const promotions=await Promoter.find(id);
    const userData=await UserData.findByOrFail('id_user',user.id);
    const doner=await Doner.findByOrFail('id_user_data',userData.id);

    if(userData.rol!=4){
      return response.json({message:'Not authorized'});
    }
    else{
      await promotions.delete();
      return response.json({promotions});
    }

  }
}

module.exports = PromoterController
