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

  Route.post('user/register','UserController.store');
  Route.post('user/login','UserController.login');
  Route.post('user/resetPassword','UserController.resetPassword');

  //donador 
  Route.post('user/score','ScoreQuizController.store');
  Route.post('user/appointment','MedicalAppointMentController.store');
  Route.delete('user/appointment/delete/:id','MedicalAppointMentController.destroy');
  Route.put('user/appointment/update/:id','MedicalAppointMentController.update');
  Route.get('user/appointment/all','MedicalAppointMentController.index');

}).prefix('api/v1/');
