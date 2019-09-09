const winston = require('winston');

//To build a middleware function
function log(req, res, next) {
    console.log('logging....')
    //used to raise an event when an exception is not caught within the express app
// process.on('uncaughtException', (ex) =>{
// logger.error("we got an uncaught exception", ex);
// process.exit(1); //best practise to always terminate process
// });

//for unhanled asynchronous calls
// process.on('unhandledRejection', (ex) =>{
//     logger.error("we got an unhandled rejection", ex);
//     process.exit(1);
//     });

    //used to pass control to the next middle ware
    next();
}

const logger = winston.createLogger({
    transports:[new winston.transports.File({
        filename: 'logFile.log',
        handleExceptions: true
    })],
    //log to mongo db
    level: 'error'
    // format: winston.format.json()
});

// logger.remove(new winston.transports.Console());

//export the function as a module
exports.log = log;
exports.logger = logger;
