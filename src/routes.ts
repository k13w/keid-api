import { Router } from 'express';
import UserController from './controllers/UserController';
import AuthController from './controllers/AuthController';

const routes = Router();

routes.get('/users', UserController.listAll);
routes.post('/users', UserController.newUser);
routes.put('/users', UserController.editUser);
routes.delete('/users', UserController.deleteUser);
routes.post('/sessions', AuthController.sessions);

export default routes;