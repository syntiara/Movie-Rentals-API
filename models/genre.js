const Joi = require('joi');
const mongoose = require('mongoose');

//this schema defines structure of the table in mongo db
const genreSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 5,
    }
});

//to create a class model/ table from the schema
const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre) {
    // if (!genre.name) return 'name is required';
    // else if (genre.name.length < 5 || genre.name.length > 20) return 'name must be between 5 and 20 characters'
    const schema = {
        name: Joi.string().min(5).max(50).required()
    }
    return Joi.validate(genre, schema)
}

exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = genreSchema;