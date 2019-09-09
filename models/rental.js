
const Joi = require('joi');
const mongoose = require('mongoose');
const { movieSchema } = require('./movie');
const { customerSchema } = require('./customer');


const rentalSchema = new mongoose.Schema({
    customer:
    {
        type: customerSchema,
        required: true
    },
    movie:
    {
        type: movieSchema,
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now()
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

//to create a class model/ table from the schema
const Rental = mongoose.model('Rental', rentalSchema);


function validateRental(rental) {
    const schema = {
        //to validate the obejct ids
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    }
    return Joi.validate(rental, schema)
}

exports.Rental = Rental;
exports.validate = validateRental;