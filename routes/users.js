const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/user'); //object destructuring
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');


router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //check if user is already registered
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send('User already registered');

        user = new User(_.pick(req.body, ['name', 'email', 'password']));

        //for hashing password using a salt
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        //_id is created by mongodb driver before hitting the db
        await user.save();

        //get token
        const token = user.generateAuthToken();
        //set header with token and /use lodash to select the properties to return to the client
        res.header("x-auth-token", token).send(_.pick(user, ['_id', 'name', 'email']));
    }
    catch (err) {
        res.send(err);
    }
})

router.get('/', async (req, res) => {
    const user = await User.findById(id).sort({ name: 1 })
    res.send(_.pick(user, ['_id', 'name', 'email']));
})

//the route is named '/me' beacuse I don't want to expose the id of the user
//I can get it from jwt web token
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
})

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
    if (!user) return res.status(404).send('The user with the given id was not found.')

    res.send(_.pick(user, ['_id', 'name', 'email']));
})

router.delete('/:id', async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id)
    if (!user) return res.status(404).send('The user with the given id was not found.')

    res.send(_.pick(user, ['_id', 'name', 'email']));
})

module.exports = router;