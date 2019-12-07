'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


const User=use('App/Models/User');
const DataUser=use('App/Models/UserDatum');
const BloodDoner=use('App/Models/BloodDoner');
const Administrator=use('App/Models/Administrator');
const Hash = use('Hash');
const nodemailer = require('nodemailer');
const TwoStep=use('App/Models/TwoStep');

class UserController {
 
  async index ({ request, response, view }) {
  }

  async create ({ request, response, view }) {
  }
  
  async login({request,response,auth}){
    const data=request.all();
    const token = await auth.attempt(data.email,data.password);
    const user =await User.findByOrFail('email',data.email);
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
            curp:bloodDoner.curp,
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
            curp:bloodDoner.curp,
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
     
     user.userName=data.userName
     user.userFirtsName=data.userFirtsName;
     user.userLastName=data.userLastName;
     user.email=data.email;
     user.password=data.password;

     dataUser.sex=data.sex;
     dataUser.movilPhone=data.movilPhone;
     dataUser.dateBirth=data.dateBirth;
     dataUser.rol=data.rol;
     data.status=false;
     dataUser.rol=data.rol;
     dataUser.status=data.status;

    if (data.rol=="1"&&data.password.match(/[a-z]/g) &&data.password.match( /[A-Z]/g) &&
        data.password.match( /[0-9]/g) && data.password.match( /[^a-zA-Z\d]/g)&&
        data.password.length>=8){
          await user.save();
          dataUser.id_user=user.id;
          await dataUser.save();
          const bloodDoner=new BloodDoner();
          bloodDoner.bloodType=data.bloodType;
          bloodDoner.curp=data.curp;
          bloodDoner.id_user_data=dataUser.id;
          await bloodDoner.save();
          return this.login(...arguments);
    } 
    if(data.rol=="2"&&data.password.match(/[a-z]/g) &&data.password.match( /[A-Z]/g) &&
       data.password.match( /[0-9]/g) && data.password.match( /[^a-zA-Z\d]/g)&&
       data.password.length>=8){
        await user.save();
        dataUser.id_user=user.id;
        await dataUser.save();
        const bloodDoner=new BloodDoner();
        bloodDoner.bloodType=data.bloodType;
        bloodDoner.curp=data.curp;
        bloodDoner.id_user_data=dataUser.id;
        await bloodDoner.save();
        const master=new Administrator();
        master.id_blood_doner=bloodDoner.id;
        await master.save();         
        
        const twoStep=new TwoStep();
        twoStep.id_administrator=master.id;
        var max=5000;
        var min=1000;
        var numero=Math.floor(Math.random() * (max - min)) + min;
        twoStep.number=numero;
        await twoStep.save();

        return this.login(...arguments);
    } 

    return response.json({message:'error not password permited'})
  }

  async changePassword ({ request, response, auth }) {
    const user = await auth.getUser();
    const data=request.all();
    const uservalidate = await User.findByOrFail('id',user.id);
    const passwordCheck = await Hash.verify(data.password,uservalidate.password);

    if (!passwordCheck) {
      return response
        .status(400)
        .send({ message: { error: 'Incorrect password provided' } })
    }
    else{
      if(data.newPassword.match(/[a-z]/g) &&data.newPassword.match( /[A-Z]/g) &&
      data.newPassword.match( /[0-9]/g) && data.newPassword.match( /[^a-zA-Z\d]/g)&&
      data.newPassword.length>=8){
        user.password =data.newPassword
        await user.save()
        return response.json({ message:'Password Success'})
      }
      else{
        return response.json({message:'la contrasenia debe de tener mayusculas minusculas numero y caracteres'});  
      }

    }
   
  }

  async show ({ params, request, response, view }) {
  }

  async resetPassword({request,response}){
    const data =request.all()
    const newPassword=data.newPassword;
    const id=data.id
    const user=await User.findByOrFail('id',id);
    if(newPassword.match(/[a-z]/g)&&newPassword.match( /[A-Z]/g) &&
       newPassword.match( /[0-9]/g)&&newPassword.match( /[^a-zA-Z\d]/g)&&
       newPassword.length>=8){
           user.password = newPassword;
           await user.save()
           return response.json({ message: 'Password Success!'})      
      }
    return response.json({message:'eror not password permited'});
  }

  async forgotPassword({request,response}){
    const data=request.all();
    var sent="";
    const user=await User.findByOrFail('email',data.email);
    var id=user.id;
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '153224@ids.upchiapas.edu.mx',
        pass: 'leon1994'
      }
    });
    var mailOptions = {
      from: '153224@ids.upchiapas.edu.mx',
      to:data.email,
      subject: 'reset password',
      text: 'reset password',
      html: `<h1> reset password </h1>
      <p>link</p>
      <a href="http://localhost:8080/resetpassword/${id}">http://bancosDeSangre/resetpassword</a>`,
    }; 
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error){
          sent=false;
        } else {
          sent=true;
        }
    });

    if(sent=true){
      return response.json({message:'email sent'})
    }
    else{
      return response.json({message:'email not sent'})
    }

  }

  
  async edit ({ params, request, response, view }) {
  }

  async update ({ params, request, response }) {
  }

  async destroy ({ params, request, response }) {
  }
}

module.exports = UserController
