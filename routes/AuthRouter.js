import AuthController from '../controllers/AuthController';
const AuthRouter = require("express").Router();

AuthRouter.post('/create', AuthController.createUser);
AuthRouter.get('/login', AuthController.login);
AuthRouter.get('/forgot-password', AuthController.forgotPassword);

