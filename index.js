const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { port, database, secretKey } = require("./config")
// Build a web server 
const express = require('express');
const mongoose = require('mongoose');
const app = express();
//use the logger module defined in a separate class
const log = require('./middleware/logger');
const { error } = require('./middleware/error');
const genreRoute = require('./routes/genres');
const customerRoute = require('./routes/customers');
const movieRoute = require('./routes/movies');
const rentalRoute = require('./routes/rentals');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');

//application should exit if the secret is not defined
if (!secretKey) {
    console.error("FATAL ERROR: Secret is not defined");
    process.exit(1); //anything but 0 means it wasn't successful
}

//coonect to database
mongoose.connect(database)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

//installs a middleware function in the request processing pipeline. Middleware function are called in sequence
app.use(express.json())
app.use(log);
app.use('/api/genres', genreRoute); //append "/api/genres" to any route using genreRoute
app.use('/api/customers', customerRoute);
app.use('/api/movies', movieRoute);
app.use('/api/rentals', rentalRoute);
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);


//using express.js middleware function to catch errors
app.use(error);

//This is where the application is launched
app.listen(port, () => { console.log(`Listening on port ${port}`) });

