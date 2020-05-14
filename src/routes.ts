import { Router } from 'express';
import multer from 'multer';

import UserController from './controllers/UserController';
import AuthController from './controllers/AuthController';
import UploadController from './controllers/UploadController'

import { checkJwt } from './middlewares/checkJwt';

import config from './config/multer';

const upload = multer(config)

const routes = Router();

routes.post('/users', UserController.newUser);
routes.post('/sessions', AuthController.sessions);
routes.get('/users/:user_id/files', UploadController.files);

routes.use(checkJwt);

routes.get('/users', UserController.listAll);
routes.put('/users', UserController.editUser);
routes.delete('/users', UserController.deleteUser);


routes.post('/users/:user_id/files', upload.single('file'), UploadController.uploadFiles);

export default routes;