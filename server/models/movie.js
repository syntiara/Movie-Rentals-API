
import Joi from 'joi';
import mongoose from 'mongoose';
import { genreSchema } from './genre';

export const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        trim: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255

    },
    genre:
    {
        type: genreSchema,
        required: true
    }
});

//to create a class model/ table from the schema
export const Movie = mongoose.model('Movie', movieSchema);


export const validate = movie => {

    const schema = {
        title: Joi.string().min(5).max(255).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required(),
    }
    return Joi.validate(movie, schema, { allowUnknown: true })
}
