import {Movie, validate} from '../models/movie';  //object destructuring
import {validateObjectId, requestValidator} from '../middleware/validation';
import auth from '../middleware/auth';
import express from 'express';

const router = express.Router();

/**
     * @swagger
     * definition:
     *   inputMovie:
     *     properties:
     *      title: 
     *        type: string
     *      genreId:
     *         type: string
     *      name:
     *         type: string
     *      dailyRentalRate:
     *         type: number
     *      numberinStock: 
     *         type: number
     */

       /**
     * @swagger
     * definition:
     *   outputMovie:
     *     properties:
     *      id:
     *       type: string
     *      title: 
     *        type: string
     *      genre:
     *         type: object
     *         properties:
     *            id:
     *             type: string
     *            name:
     *              type: string
     *      dailyRentalRate:
     *         type: number
     *      numberinStock: 
     *         type: number
     */

     /**
         * @swagger
         * /movies:
         *   post:
         *     tags:
         *       - Movies
         *     description: create new movie
         *     security:
         *       - bearerAuth: []
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
         *       - name: movie
         *         description: movie object
         *         in: body
         *         required: true
         *         schema:
         *           $ref: '#/definitions/inputMovie'
         *     responses:
         *       200:
         *         description: Return created movie
         *         schema:
         *           $ref: '#/definitions/outputMovie'
         *       400:
         *         description: Bad request
         *       403:
         *         description: unauthorized
         */
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

 /**
         * @swagger
         * /movies:
         *   get:
         *     tags:
         *       - Movies
         *     description: Get all movies
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: Get all movies
         *         schema:
         *           $ref: '#/definitions/outputMovie'
         *       400:
         *         description: Bad request

*/
router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');
    //when the request is sent, the response is exposed using the 'send' keyword
    res.send(movies);
})

 /**
         * @swagger
         * /movies/{id}:
         *   get:
         *     tags:
         *       - Movies
         *     description: Get specific movie detail
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
         *     responses:
         *       200:
         *         description: Return specific movie detail
         *         schema:
         *           $ref: '#/definitions/outputMovie'
         *       400:
         *         description: Bad request
         *       404:
         *         description: cannot find movie with the given id

*/
router.get('/:id', validateObjectId, async (req, res) => {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).send('The movie with the given id was not found.')

    res.send(movie);
})

     /**
         * @swagger
         * /movies/{id}:
         *   put:
         *     tags:
         *       - Movies
         *     description: update specific movie details
         *     security:
         *       - bearerAuth: []
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
         *       - name: movie
         *         description: movie object
         *         in: body
         *         required: true
         *         schema:
         *           $ref: '#/definitions/inputMovie'
         *     responses:
         *       200:
         *         description: Return updated movie
         *         schema:
         *           $ref: '#/definitions/outputMovie'
         *       400:
         *         description: Bad request
         *       403:
         *         description: unauthorized
         *       404:
         *         description: cannot find movie with the given id
         */
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

/**
             * @swagger
             * /movies/{id}:
             *   delete:
             *     tags:
             *       - Movies
             *     description: Delete specific movie
             *     security:
             *       - bearerAuth: []
             *     produces:
             *       - application/json
	     *     parameters:
	     *       - name: id
	     *         in: path
	     *         required: true
	     *         type: string
             *     responses:
             *       200:
             *         description: Return deleted movie
             *         schema:
             *           $ref: '#/definitions/outputMovie'
             *       400:
             *         description: Bad request
             *       404:
             *         description: cannot find movie with the given id
             */
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id)
    if (!movie) return res.status(404).send('The movie with the given id was not found.')

    res.send(movie);
})

export default router;
