import {validateObjectId, requestValidator} from '../middleware/validation';
import {Genre, validate} from '../models/genre';  //object destructuring
import auth from '../middleware/auth';
import express from 'express';
import { asyncMiddleWare } from '../middleware/error';
const router = express.Router();

/**
         * @swagger
         * /genres:
         *   post:
         *     tags:
         *       - Genres
         *     description: create new genre
         *     security:
         *       - bearerAuth: []
         *     produces:
         *       - application/json
         *     parameters:
	     *       - name: name
	     *         description: genre name
	     *         in: body
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *              name: 
         *                type: string
         *     responses:
         *      200:
         *         description: Return created genre
         *         schema: 
         *             type: object
         *             properties:
         *              id: 
         *                type: string
         *              name: 
         *                type: string
         *      400:
         *            description: Bad request
         *      403:
         *            description: unauthorized

 */

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

/**
         * @swagger
         * /genres:
         *   get:
         *     tags:
         *       - Genres
         *     description: get all genres
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: Return all existing genre
         *         schema: 
         *             type: object
         *             properties:
         *              id: 
         *                type: string
         *              name: 
         *                type: string
 */
router.get('/', asyncMiddleWare(async (req, res) => {
    const genres = await Genre.find().sort('name');
    //when the request is sent, the response is exposed using the 'send' keyword
    res.send(genres);
}));

/**
         * @swagger
         * /genres/{id}:
         *   get:
         *     tags:
         *       - Genres
         *     description: get specific genre details
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
         *     responses:
         *       200:
         *         description: Return specific genre details
         *         schema: 
         *             type: object
         *             properties:
         *              id: 
         *                type: string
         *              name: 
         *                type: string
         *       404:
         *         description: cannot find genre with the given id
 */
router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id)
    if (!genre) return res.status(404).send('The genre with the given id was not found.')

    res.send(genre);
})

/**
         * @swagger
         * /genres/{id}:
         *   put:
         *     tags:
         *       - Genres
         *     description: update specific genre details
         *     security:
         *       - bearerAuth: []
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
	     *       - name: name
	     *         description: genre name
	     *         in: body
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *              name: 
         *                type: string
         *     responses:
         *       200:
         *         description: Return updated genre
         *         schema: 
         *             type: object
         *             properties:
         *              id: 
         *                type: string
         *              name: 
         *                type: string
         *       400:
         *         description: Bad request
         *       403:
         *         description: unauthorized
         *       404:
         *         description: cannot find genre with the given id
 */
router.put('/:id', auth, validateObjectId, async (req, res) => {

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
    if (!genre) return res.status(404).send('The genre with the given id was not found.')

    res.send(genre);
})

/**
             * @swagger
             * /genres/{id}:
             *   delete:
             *     tags:
             *       - Genres
             *     description: Delete specific genre
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
             *      200:
             *         description: Return deleted genre
             *         schema: 
             *             type: object
         *             properties:
         *              id: 
         *                type: string
         *              name: 
         *                type: string
             *      400:
             *         description: Bad request
             *      404:
             *         description: cannot find genre with the given id
             */
router.delete('/:id', auth, validateObjectId, async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id)
    if (!genre) return res.status(404).send('The genre with the given id was not found.')

    res.send(genre);
})

export default router;
