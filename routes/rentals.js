
const { Rental, validate } = require('../models/rental')  //object destructuring
const { Customer } = require('../models/customer')
const { Movie } = require('../models/movie')
const mongoose = require('mongoose');

// Build a web server 
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


//for 2phase commits - multiple commit to the database
const Fawn = require('fawn');
Fawn.init(mongoose);

//How to specify routes in express
router.post('/', [auth, admin], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("customer not found");

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("movie not found");
    // ensure that movie being rented out is in stock
    if (movie.numberInStock === 0) return res.status(400).send("movie not in stock");
    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
        }
    });
    try {
        new Fawn.Task()
            .save('rentals', rental) //name in quotation mark must match collection name in db
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            }) //to update the movie collection i.e decrement stock by 1
            .run();

        res.send(rental);
    }
    catch (error) {
        res.status(500).send("an error occured");
    }
})

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    //when the request is sent, the response is exposed using the 'send' keyword
    res.send(rentals);
})

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id)
    if (!rental) return res.status(404).send('The rental with the given id was not found.')

    res.send(rental);
})

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    const movie = await Rental.findByIdAndUpdate(req.params.id,
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

router.delete('/:id', async (req, res) => {
    const rental = await Rental.findByIdAndRemove(req.params.id)
    if (!rental) return res.status(404).send('The rental with the given id was not found.')

    res.send(rental);
})

module.exports = router;
