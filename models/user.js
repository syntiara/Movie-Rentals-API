import Joi from 'joi';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
const { secretKey } = require("../config");

//this schema defines structure of the table in mongo db
export const userSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true,
        maxlength: 100,
        minlength: 5,
    },
    email:
    {
        type: String,
        required: true,
        maxlength: 255,
        minlength: 5,
        unique: true //to avoid duplicate emails
    },
    password:
    {
        type: String,
        required: true,
        maxlength: 1000,
        minlength: 5,
    },
    isAdmin: Boolean
});

//to make the user have an instance method called generateAuthToken
userSchema.methods.generateAuthToken = function () {
    //I used this keyword because I am working with the user schema directly
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, secretKey);
}

//to create a class model/ table from the schema
export const User = mongoose.model('User', userSchema);

export const validateUser = user => {
    const schema = {
        name: Joi.string().min(5).max(100).required(),
        email: Joi.string().min(5).max(255).required().email(), //to validate email
        password: Joi.string().min(5).max(1000).required()
    }
    return Joi.validate(user, schema)
}