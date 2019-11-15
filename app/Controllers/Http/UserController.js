'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


const User=use('App/Models/User');
const DataUser=use('App/Models/UserDatum');
const Medico=use('App/Models/Medico');
const BloodDoner=use('App/Models/BloodDoner');
const Administrator=use('App/Models/Administrator');
const Recepcionist=use('App/Models/Recepcionist');
const Hash = use('Hash');
/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new user.
   * GET users/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }
  
  async login({request,response,auth}){
    const data=request.all();
    const token = await auth.attempt(data.email,data.password);
    const user =await User.findByOrFail('email',data.email);
    if(user){
      const userData=await DataUser.findByOrFail('id_user',user.id)
      if(userData.rol==1){
        try{
         const medico= await Medico.findByOrFail('id_user_data',userData.id);
         return response.json({token,medico});
        }catch(exception){
         return response.status(404);  
        }
      }
     
      if(userData.rol==2){
        try{
          const bloodDoner= await BloodDoner.findByOrFail('id_user_data',userData.id);
          return response.json({token,bloodDoner});
         }catch(exception){
          return response.status(404);  
         }
      }
     
      if(userData.rol==3){
        try{
          const administrator= await Administrator.findByOrFail('id_user_data',userData.id);
          return response.json({token,administrator});
         }catch(exception){
          return response.status(404);  
         }
      }

      if(userData.rol==4){
        try{
          const recepcionist= await Recepcionist.findByOrFail('id_user_data',userData.id);
          return response.json({token,recepcionist});
         }catch(exception){
          return response.status(404);  
         }
      }

      else{
        return response.status(404).json({message:'not found'});
      }
      
    }
  }
  
  async store ({ request, response }) {
    const data=request.all();
    const user =new User();
    const dataUser=new DataUser();
     //fields user
     user.userName=data.userName
     user.userFirtsName=data.userFirtsName;
     user.userLastName=data.userLastName;
     user.email=data.email;
     user.password=data.password;
     //fileds data users
     dataUser.sex=data.sex;
     dataUser.movilPhone=data.movilPhone;
     dataUser.dateBirth=data.dateBirth;
     dataUser.rol=data.rol;
     data.status=false;
     dataUser.status=data.status;

     console.log("name "+data.userName);
     console.log("apellido 1 "+data.userFirtsName);
     console.log("apellido 2 "+data.userLastName);
     console.log("email "+data.email);
     console.log("password "+data.password);
     console.log("-----------");
     console.log("sex "+data.sex);
     console.log("movil "+data.movilPhone);
     console.log("data Birth "+data.dateBirth);
     console.log("rol "+data.rol);
     console.log("status "+data.status);

     if(data.rol==1){
       console.log("entro perro rol 1");
       await user.save();
       dataUser.id_user=user.id;
       await dataUser.save();
       const medico=new Medico();
       medico.speciality=data.speciality;
       medico.id_user_data=dataUser.id;
       console.log("soy medico ")
       console.log("medico espciality "+data.speciality);
       console.log("medico id_user_data "+dataUser.id)
       await medico.save();
       return this.login(...arguments);
     }
     
    if(data.rol==2){
      await user.save();
      dataUser.id_user=user.id;
      await dataUser.save();
      console.log("soy doner ");
      const bloodDoner=new BloodDoner();
      bloodDoner.bloodType=data.bloodType;
      bloodDoner.curp=data.curp;
      bloodDoner.id_user_data=dataUser.id;
      console.log("blood type "+data.bloodType);
      console.log("curp "+data.curp); 
      console.log("doner "+dataUser.id);
      await bloodDoner.save();
      return this.login(...arguments);
    }
    if(data.rol==3){
      await user.save();
      dataUser.id_user=user.id;
      await dataUser.save();
      console.log("soy administrator ");
      const administrator=new Administrator();
      administrator.id_user_data=dataUser.id;
      console.log("administrator "+dataUser.id);
      await administrator.save();
      return this.login(...arguments);   
    }
    if(data.rol==4){
      await user.save();
      dataUser.id_user=user.id;
      await dataUser.save();
      console.log("soy recepcionist ");
      const recepcionist=new Recepcionist();
      recepcionist.id_user_data=dataUser.id;
      console.log("recepcionist "+dataUser.id); 
      await recepcionist.save();
      return this.login(...arguments); 
    }
    else{
      response.json({message:'error not sucessfull'})
    }

  }


  async resetPassword ({ request, response, auth }) {
    const user = await auth.getUser();
    const { password, newPassword } = request.only(['password', 'newPassword']);
    
    const uservalidate = await User.findByOrFail('id',user.id);
    const passwordCheck = await Hash.verify(password, uservalidate.password);

    if (!passwordCheck) {
      return response
        .status(400)
        .send({ message: { error: 'Incorrect password provided' } })
    }

    user.password = newPassword
  
    await user.save()
    return response.json({ message: 'Password Success!'})
  }


  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing user.
   * GET users/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = UserController
