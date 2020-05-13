import { Router } from 'express';
import multer from 'multer';
import UserController from './controllers/UserController';
import AuthController from './controllers/AuthController';
import UploadController from './controllers/UploadController'

import config from './config/multer';

const routes = Router();

routes.get('/users', UserController.listAll);
routes.post('/users', UserController.newUser);
routes.put('/users', UserController.editUser);
routes.delete('/users', UserController.deleteUser);
routes.post('/sessions', AuthController.sessions);

routes.get('/users/:user_id/files', UploadController.files);
routes.post('/users/:user_id/files', multer(config).single('file'), UploadController.uploadFiles);

export default routes;