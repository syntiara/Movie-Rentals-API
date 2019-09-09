const express = require('express');
const genreRoute = require('../routes/genres');
const customerRoute = require('../routes/customers');
const movieRoute = require('../routes/movies');
const rentalRoute = require('../routes/rentals');
const userRoute = require('../routes/users');
const authRoute = require('../routes/auth');

//installs a middleware function in the request processing pipeline. Middleware function are called in sequence
module.exports = function(app) {
app.use(express.json())
app.use('/api/genres', genreRoute); //append "/api/genres" to any route using genreRoute
app.use('/api/customers', customerRoute);
app.use('/api/movies', movieRoute);
app.use('/api/rentals', rentalRoute);
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
}
