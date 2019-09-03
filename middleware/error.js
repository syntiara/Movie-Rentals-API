exports.error = function (err, req, res, next) {
    console.log('mongoose');
    res.status(500).send("internal server error");
};

exports.asyncMiddleWare = function (handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch (ex) {
            console.log(ex);
            next("got here", ex);
        }
    }
}