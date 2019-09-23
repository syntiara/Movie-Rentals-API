const bcrypt = require('bcrypt');
const _ = require('lodash');
const Joi = require('joi');
const {validateObjectId, requestValidator} = require('../middleware/validation')
const { User } = require('../models/user'); //object destructuring
const express = require('express');
const router = express.Router();
/**
         * @swagger
         * /auth:
         *   post:
         *     tags:
         *       - Authentication
         *     description: Generate user token
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: email
         *         format: email
         *         in: body
         *         required: true
         *       - name: password
         *         in: body
         *         required: true
         *     responses:
         *       200:
         *         description: Return user token
         *         schema: 
         *             type: string
         *       400:
         *         description: invalid email or password
         *       500:
         *         description: internal server error
         */
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

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(), //to validate email
        password: Joi.string().min(5).max(1000).required()
    }
    return Joi.validate(req, schema)
}

module.exports = router;