import {logger} from '../middleware/logger';

export const error =  (err, req, res, next) => {
    logger.error(err.message, err) //you can also store metadata by storing the complete error object
    res.status(500).send("internal server error occured");
};

// function for wrapping try catch block
export const asyncMiddleWare = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch (ex) {
            next(ex);
        }
    }
}