const bcrypt = require('bcrypt');
const _ = require('lodash');
const Joi = require('joi');
const { User } = require('../models/user'); //object destructuring
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //if user with given email cannot be found
        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Invalid email or password');

        //validate incoming password against existing one
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send('Invalid email or password');

        const token = user.generateAuthToken();
        res.send(token);
    }
    catch (err) {
        res.send(err);
    }
})

router.get('/', async (req, res) => {
    const user = await User.findById(id).sort({ name: 1 })
    res.send(user);
})

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).send('The user with the given id was not found.')

    res.send(user);
})

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
    if (!user) return res.status(404).send('The user with the given id was not found.')

    res.send(user);
})

router.delete('/:id', async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id)
    if (!user) return res.status(404).send('The user with the given id was not found.')

    res.send(user);
})

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(), //to validate email
        password: Joi.string().min(5).max(1000).required()
    }
    return Joi.validate(req, schema)
}

module.exports = router;