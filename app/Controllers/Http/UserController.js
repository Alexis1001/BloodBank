'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


const User=use('App/Models/User');
const DataUser=use('App/Models/UserDatum');
const BloodDoner=use('App/Models/BloodDoner');
const Administrator=use('App/Models/Administrator');
const Hash = use('Hash');

class UserController {
 
  async index ({ request, response, view }) {
  }

  async create ({ request, response, view }) {
  }
  
  async login({request,response,auth}){
    const data=request.all();
    const token = await auth.attempt(data.email,data.password);
    const user =await User.findByOrFail('email',data.email);
    console.log("user "+user.email);
    if(user){
      const userData=await DataUser.findByOrFail('id_user',user.id)
      if(userData.rol!=2){
        try{
          const bloodDoner= await BloodDoner.findByOrFail('id_user_data',userData.id);
          const doner=({
            id:bloodDoner.id,
            type:token.type,
            token:token.token,
            name:user.userName,
            firtsName:user.userFirtsName,
            lastName:user.userLastName,
            email:user.email,
            sex:userData.sex,
            movilPhone:userData.movilPhone,
            dateBirth:userData.dateBirth,
            rol:userData.rol,
            status:userData.status,
            bloodType:bloodDoner.bloodType,
          });
          return response.json({doner});
        }catch(exception){
          return response.status(404);  
        }
      }
      if(userData.rol==2){
        try{
          const bloodDoner= await BloodDoner.findByOrFail('id_user_data',userData.id);
          const administrator= await Administrator.findByOrFail('id_blood_doner',bloodDoner.id);
          const doner=({
            id:bloodDoner.id,
            type:token.type,
            token:token.token,
            name:user.userName,
            firtsName:user.userFirtsName,
            lastName:user.userLastName,
            email:user.email,
            sex:userData.sex,
            movilPhone:userData.movilPhone,
            dateBirth:userData.dateBirth,
            rol:userData.rol,
            status:userData.status,
            bloodType:bloodDoner.bloodType,
          });
          return response.json({doner});
        
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
     dataUser.rol=data.rol;
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

    if(data.rol==2){
      await user.save();
      dataUser.id_user=user.id;
      await dataUser.save();
      const bloodDoner=new BloodDoner();
      bloodDoner.bloodType=data.bloodType;
      bloodDoner.curp=data.curp;
      bloodDoner.id_user_data=dataUser.id;
      console.log("blood type "+data.bloodType);
      console.log("curp "+data.curp); 
      console.log("doner "+dataUser.id);
      await bloodDoner.save();
      console.log("soy el administrador ");
      const master=new Administrator();
      master.id_blood_doner=bloodDoner.id;
      await master.save(); 
      return this.login(...arguments);
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

  async show ({ params, request, response, view }) {
  }

  async edit ({ params, request, response, view }) {
  }

  async update ({ params, request, response }) {
  }

  async destroy ({ params, request, response }) {
  }
}

module.exports = UserController
