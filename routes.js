import express from "express";
import UsersController from "./src/controllers/UserController.js";
const apiVersion = "/v1";
const routes = express.Router();
//Rotas que serão utilizadas nas APIs
routes.post(`${apiVersion}/register`, UsersController.store);
routes.post(`${apiVersion}/sendemail`, UsersController.emailRecover);
routes.post(`${apiVersion}/passrecover`, UsersController. recoverPass);
export default routes;