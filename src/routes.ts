import { Router } from 'express';
import multer from 'multer';

import UserController from './controllers/UserController';
import AuthController from './controllers/AuthController';
import BoxController from './controllers/BoxController';
import FileController from './controllers/FileController'

import { checkJwt } from './middlewares/checkJwt';

import config from './config/multer';

const upload = multer(config)

const routes = Router();

routes.post('/users', UserController.newUser);
routes.post('/sessions', AuthController.sessions);

routes.use(checkJwt);

routes.get('/users', UserController.listAll);
routes.put('/users', UserController.editUser);
routes.delete('/users', UserController.deleteUser);

routes.get('/users/:user_id/boxes', BoxController.boxes);
routes.get('/users/:user_id/files', FileController.filesUser);
routes.get('/users/:user_id/boxes/:box_id/files', FileController.filesInBox);
routes.post('/users/:user_id/boxes', BoxController.NewBox);
routes.post('/users/:user_id/boxes/:box_id/files', upload.single('file'), FileController.uploadFiles);

export default routes;