import Joi from 'joi';
Joi.objectId = require('joi-objectid')(Joi);
import { port, secretKey } from './config';
// Build a web server 
import express from 'express';
import { error } from './middleware/error';
import {log, logger} from './middleware/logger';
import routes from './startup/routes';
import db from './startup/db';
import prod from './startup/prod';  

const app = express();

routes(app);
log; logger; db;
prod(app);
//application should exit if the secret is not defined
if (!secretKey) {
    console.error("FATAL ERROR: Secret is not defined");
    process.exit(1); //anything but 0 means it wasn't successful
}
//installs a middleware function in the request processing pipeline. Middleware function are called in sequence
app.use(error);

//This is where the application is launched
const server = app.listen(port, async () => { await console.log(`Listening on port ${port}`) });

export default server;
  