const {validateObjectId, requestValidator} = require('../middleware/validation');
const { Movie, validate } = require('../models/movie')  //object destructuring
const { Genre } = require('../models/genre')
const auth = require('../middleware/auth');


// Build a web server 
const express = require('express');
const router = express.Router();

//How to specify routes in express
router.post('/', [auth, requestValidator(validate)], async (req, res) => {
    try {
        const genre = await Genre.findById(req.body.genreId);
        if (!genre) return res.status(400).send("invalid genre id");
        let movie = new Movie({
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            dailyRentalRate: req.body.dailyRentalRate,
            numberInStock: req.body.numberInStock
        });
        //_id is created by mongodb driver before hitting the db
        await movie.save();
        res.send(movie);
    }
    catch (err) {
        res.send(err);
    }
})

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');
    //when the request is sent, the response is exposed using the 'send' keyword
    res.send(movies);
})

router.get('/:id', validateObjectId, async (req, res) => {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).send('The movie with the given id was not found.')

    res.send(movie);
})

router.put('/:id', [auth, validateObjectId, requestValidator(validate)], async (req, res) => {

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    const movie = await Movie.findByIdAndUpdate(req.params.id,
        {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            dailyRentalRate: req.body.dailyRentalRate,
            numberInStock: req.body.numberInStock

        }, { new: true })
    if (!movie) return res.status(404).send('The movie with the given id was not found.')

    res.send(movie);
})

router.delete('/:id', validateObjectId, async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id)
    if (!movie) return res.status(404).send('The movie with the given id was not found.')

    res.send(movie);
})

module.exports = router;
