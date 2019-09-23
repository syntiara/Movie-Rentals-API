const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
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
const Customer = mongoose.model('Customer', customerSchema);


function validateCustomer(customer) {
    // if (!customer.name) return 'name is required';
    // else if (customer.name.length < 5 || customer.name.length > 50) return 'name must be between 5 and 20 characters'
    // if (!customer.phone) return 'phone is required';
    // else if (customer.phone.length < 8 || customer.phone.length > 14) return 'phone must be between 5 and 20 characters'
    const schema = {
        name: Joi.string().min(5).max(20).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(8).max(14).required()
    };
    return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
exports.customerSchema = customerSchema;