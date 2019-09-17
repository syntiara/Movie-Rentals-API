const {database} = require("../config")
const mongoose = require('mongoose');
const{logger} = require('../middleware/logger');


//coonect to database
exports = mongoose.connect(database)
    .then(() => logger.info(`Connected ${database} to MongoDB...`))
