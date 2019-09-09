const { Customer, validate } = require('../models/customer')  //object destructuring
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        let customer = new Customer({
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        });
        //_id is created by mongodb driver before hitting the db
        await customer.save();
        res.send(customer);
    }
    catch (err) {
        res.send(err);
    }
})

router.get('/', async (req, res) => {
    const customer = await Customer.findById(id).sort({ name: 1 })
    res.send(customer);
})

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(404).send('The customer with the given id was not found.')

    res.send(customer);
})

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
    if (!customer) return res.status(404).send('The customer with the given id was not found.')

    res.send(customer);
})

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id)
    if (!customer) return res.status(404).send('The customer with the given id was not found.')

    res.send(customer);
})

module.exports = router;