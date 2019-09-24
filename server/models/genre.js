import Joi from 'joi';
import mongoose from 'mongoose';

//this schema defines structure of the table in mongo db
export const genreSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 5,
    }
});

//to create a class model/ table from the schema
export const Genre = mongoose.model('Genre', genreSchema);

export const validate = genre => {
    const schema = {
        name: Joi.string().min(5).max(50).required()
    }
    return Joi.validate(genre, schema)
}
