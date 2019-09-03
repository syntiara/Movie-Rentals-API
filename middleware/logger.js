//To build a middleware function
function log(req, res, next) {
    console.log('logging....')
    //used to pass control to the next middle ware
    next();
}

//export the function as a module
module.exports = log;