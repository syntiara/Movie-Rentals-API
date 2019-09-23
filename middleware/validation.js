import mongoose from 'mongoose';

export const validateObjectId =  (req, res, next) => {
    return (mongoose.Types.ObjectId.isValid(req.params.id)) ? next() :  res.status(404).send('invalid Id');
}

export const requestValidator = (validator) => {
    return(req,res, next) =>{ 
        const {error} = validator(req.body);
        return error? res.status(400).send(error.details[0].message) : next(); 

    }
}
