const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { port, secretKey } = require("./config")
// Build a web server 
const express = require('express');
const { error } = require('./middleware/error');
const app = express();
require('./middleware/logger');
require('./startup/routes')(app);
require('./startup/db');
require('./startup/prod')(app);  


//application should exit if the secret is not defined
if (!secretKey) {
    console.error("FATAL ERROR: Secret is not defined");
    process.exit(1); //anything but 0 means it wasn't successful
}
//installs a middleware function in the request processing pipeline. Middleware function are called in sequence
app.use(error);

//This is where the application is launched
const server = app.listen(port, () => { console.log(`Listening on port ${port}`) });

module.exports = server; 
  