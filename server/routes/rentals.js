import { Client } from '../models/client';
import { Movie } from '../models/movie';
import mongoose from 'mongoose';
import {Rental, validate} from '../models/rental';  //object destructuring
import {validateObjectId, requestValidator} from '../middleware/validation';
import auth from '../middleware/auth';
import admin from '../middleware/admin';
import Fawn from 'fawn';
import express from 'express';

const router = express.Router();

//for 2phase commits - multiple commit to the database
Fawn.init(mongoose);

/**
     * @swagger
     * definition:
     *   rental:
     *     properties:
     *        id:
     *          type: string
     *        client:
     *          type: object
     *          properties:
     *             id:
     *               type: string
     *             name:
     *               type: string
     *             phone:
     *               type: string
     *        movie:
     *          type: object
     *          properties:
     *             id:
     *               type: string
     *             title:
     *                type: string
     *             dailyRentalRate:
     *                 type: number
     */

/**
         * @swagger
         * /rentals:
         *   post:
         *     tags:
         *       - Rentals
         *     description: Create new rental
         *     security:
         *       - bearerAuth: []
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: rental
         *         in: body
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             clientId: 
         *                type: string
         *             movieId: 
         *                type: string
         *     responses:
         *       200:
         *         description: Return created rental
         *         schema:
         *           $ref: '#/definitions/rental'
         *       400:
         *         description: Bad request
         *       403:
         *         description: Unauthorized
         *       500:
         *         description: Internal server error
         */
//How to specify routes in express
router.post('/', [auth, admin, requestValidator(validate)], async (req, res) => {

  const client = await Client.findById(req.body.clientId);
  if (!client) return res.status(400).send('client not found');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('movie not found');
  // ensure that movie being rented out is in stock
  if (movie.numberInStock === 0)
    return res.status(400).send('movie not in stock');
  let rental = new Rental({
    client: {
      _id: client._id,
      name: client.name,
      phone: client.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  try {
    new Fawn.Task()
      .save('rentals', rental) //name in quotation mark must match collection name in db
      .update(
        'movies',
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 }
        }
      ) //to update the movie collection i.e decrement stock by 1
      .run();

    res.send(rental);
  } catch (error) {
    res.status(500).send('an error occured');
  }
});

 /**
         * @swagger
         * /rentals:
         *   get:
         *     tags:
         *       - Rentals
         *     description: Get all rentals
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: Get all rentals
         *         schema:
         *           $ref: '#/definitions/rental'
*/
router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  //when the request is sent, the response is exposed using the 'send' keyword
  res.send(rentals);
});

 /**
         * @swagger
         * /rentals/{id}:
         *   get:
         *     tags:
         *       - Rentals
         *     description: Get specific rental details
         *     produces:
         *       - application/json
         *     parameters:
         *        - name: id
         *          in: path
         *          required: true
         *     responses:
         *       200:
         *         description: Return specific rental details
         *         schema:
         *           $ref: '#/definitions/rental'
         *       400:
         *         description: Bad request
         *       404:
         *         description: cannot find rental with the given id

*/
router.get('/:id', validateObjectId, async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental)
    return res.status(404).send('The rental with the given id was not found.');

  res.send(rental);
});

/**
             * @swagger
             * /rentals/{id}:
             *   delete:
             *     tags:
             *       - Rentals
             *     description: Delete specific rental details
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
            *         description: Return deleted rental details
            *         schema:
            *            $ref: '#/definitions/rental'
             *       400:
             *         description: Bad request
             *       404:
             *         description: cannot find rental with the given id
             */

router.delete('/:id', [auth, validateObjectId], async (req, res) => {
  const rental = await Rental.findByIdAndRemove(req.params.id);
  if (!rental)
    return res.status(404).send('The rental with the given id was not found.');

  res.send(rental);
});

/**
         * @swagger
         * /rentals/returns:
         *   post:
         *     tags:
         *       - Rentals
         *     description: Enter record for returned rental
         *     security:
         *       - bearerAuth: []
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: rental
         *         in: body
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             clientId: 
         *                type: string
         *             movieId: 
         *                type: string
         *     responses:
         *       200:
         *         description: Return record of returned rental
         *         schema:
         *           $ref: '#/definitions/rental'
         *       400:
         *         description: Bad request
         *       403:
         *         description: Unauthorized
         *       404:
         *         description: cannot find rental with the given id
         *       500:
         *         description: Internal server error
         */
  router.post('/returns', [auth, admin, requestValidator(validate)], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
      const rental = await Rental.lookUpRental(req.body.clientId, req.body.movieId);

    if (!rental) return res.status(404).send('rental not found');
    if(rental.dateReturned) return res.status(400).send('rental already processed');

    rental.calcRentalFee();
    
    await Movie.update({_id: rental.movie._id}, {
        $inc: {numberInStock: 1
        }
    });
    await rental.save();

    return res.status(200).send(rental);
  } catch (error) {
    res.status(500).send('an error occured');
  }
});

export default router;
