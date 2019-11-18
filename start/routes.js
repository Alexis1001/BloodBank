'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.group(() => {
  
 // users
  Route.post('user/register','UserController.store');
  Route.post('user/login','UserController.login');
  Route.post('user/resetPassword','UserController.resetPassword');
  
  //[Master]
  // ver todo los donadores 
  Route.get('user/all','AdministratorController.indexDoners');
  // editar el rol de un donador en especifico
  Route.put('user/edit/:id','AdministratorController.updateDoners');
  //eliminar a un donador en epecifico 
  Route.delete('user/delete/:id','AdministratorController.destroy');



  //[donador encuesta]
  //insertar el porcentaje obtenido en la encuesta por donador
  Route.post('user/score','ScoreQuizController.store');
  //obtener el historial de  porcetajes de encuesta realizada por cada donador
  Route.get('user/score/all','ScoreQuizController.index');


  //[donador citas]
  //gerar cita
  Route.post('user/appointment','MedicalAppointMentController.store');
  //borrar cita
  Route.delete('user/appointment/delete/:id','MedicalAppointMentController.destroy');
  //actualizar cita
  Route.put('user/appointment/update/:id','MedicalAppointMentController.update');
  //ver todas las citas del deterinado usuario
  Route.get('user/appointment/all','MedicalAppointMentController.index');
 //ver la ultimacita generada
  Route.get('user/appointment/lastAppointment','MedicalAppointMentController.lastApointment');


}).prefix('api/v1/');
