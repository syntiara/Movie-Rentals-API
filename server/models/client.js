import Joi from 'joi';
import mongoose from 'mongoose';

export const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        // default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 14
    }
});

//to create a class model/ table from the schema
export const Client = mongoose.model('client', clientSchema);


export const validate = client => {
    // if (!client.name) return 'name is required';
    // else if (client.name.length < 5 || client.name.length > 50) return 'name must be between 5 and 20 characters'
    // if (!client.phone) return 'phone is required';
    // else if (client.phone.length < 8 || client.phone.length > 14) return 'phone must be between 5 and 20 characters'
    const schema = {
        name: Joi.string().min(5).max(20).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(8).max(14).required()
    };
    return Joi.validate(client, schema);
}