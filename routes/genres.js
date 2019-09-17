const {validateObjectId, requestValidator} = require('../middleware/validation')
const { Genre, validate} = require('../models/genre');  //object destructuring
const auth = require('../middleware/auth');
//ES6 syntax, since am using 'export default' in the middleware
// import auth from '../middleware/auth';
// Build a web server 
const express = require('express');
const { asyncMiddleWare } = require('../middleware/error');
const router = express.Router();

//How to specify routes in express
router.post('/', [auth, requestValidator(validate)], async (req, res, next) => {
    try {
        let genre = new Genre({
            name: req.body.name
        });
        //_id is created by mongodb driver before hitting the db
        await genre.save();
        res.status(201).send(genre);
    }
    catch (err) {
        //the error should be caught by the error module
        next(err);
        // res.send(err);
    }
})

router.get('/', asyncMiddleWare(async (req, res) => {
    const genres = await Genre.find().sort('name');
    //when the request is sent, the response is exposed using the 'send' keyword
    res.send(genres);
}));

router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id)
    if (!genre) return res.status(404).send('The genre with the given id was not found.')

    res.send(genre);
})

router.put('/:id', [auth, validateObjectId, requestValidator(validate)], async (req, res) => {

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
    if (!genre) return res.status(404).send('The genre with the given id was not found.')

    res.send(genre);
})

router.delete('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id)
    if (!genre) return res.status(404).send('The genre with the given id was not found.')

    res.send(genre);
})

module.exports = router;
