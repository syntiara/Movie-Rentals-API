import {Client, validate} from '../models/client';  //object destructuring
import {validateObjectId, requestValidator} from '../middleware/validation';
import auth from '../middleware/auth';
import express from 'express';
const router = express.Router();

  /**
     * @swagger
     * definition:
     *   client:
     *     properties:
     *       name:
     *         type: string
     *       isGold:
     *         type: boolean
     *         description: for premium clients
     *       phone:
     *         type: string
     *         description: valid phone number
     */

/**
         * @swagger
         * /clients:
         *   post:
         *     tags:
         *       - clients
         *     description: create new client
         *     security:
         *       - bearerAuth: []
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: client
         *         description: client object
         *         in: body
         *         required: true
         *         schema:
         *           $ref: '#/definitions/client'
         *     responses:
         *       200:
         *         description: Return created client
         *         schema:
         *           $ref: '#/definitions/client'
         *       400:
         *         description: Bad request
         *       403:
         *         description: unauthorized
         */
        router.post('/', [requestValidator(validate)], async (req, res) => {
    try {
        let client = new Client({
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        });
        //_id is created by mongodb driver before hitting the db
        await client.save();
        res.status(200).send(client);
    }
    catch (err) {
        res.send(err);
    }
})

 /**
         * @swagger
         * /clients:
         *   get:
         *     tags:
         *       - clients
         *     description: Get all clients
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: Return existing client
         *         schema:
         *           $ref: '#/definitions/client'
*/
router.get('/', async (req, res) => {
    const client = await Client.find().sort({ name: 1 })
    res.send(client);
})

 /**
         * @swagger
         * /clients/{id}:
         *   get:
         *     tags:
         *       - clients
         *     description: Get specific client details
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
         *     responses:
         *       200:
         *         description: Return specific client details
         *         schema:
         *           $ref: '#/definitions/client'
         *       404:
         *         description: cannot find client with the given id
 */
router.get('/:id', validateObjectId,  async (req, res) => {
    const client = await Client.findById(req.params.id)
    if (!client) return res.status(404).send('The client with the given id was not found.')

    res.send(client);
})

/**
         * @swagger
         * /clients/{id}:
         *   post:
         *     tags:
         *       - clients
         *     description: Update specific client details
         *     security:
         *       - bearerAuth: []
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
	     *       - name: name
	     *         description: user's name
	     *         in: body
	     *         required: true
         *         schema:
         *           type: object
         *           properties:
         *              name: 
         *                type: string
         *     responses:
         *       200:
         *         description: Return updated client
         *         schema:
         *           $ref: '#/definitions/client'
         *       400:
         *         description: Bad request
         *       403:
         *         description: unauthorized
         *       404:
         *         description: cannot find client with the given id
 */
router.put('/:id', [auth, validateObjectId, requestValidator(validate)], async (req, res) => {

    const client = await Client.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
    if (!client) return res.status(404).send('The client with the given id was not found.')

    res.send(client);
})

/**
             * @swagger
             * /clients/{id}:
             *   delete:
             *     tags:
             *       - clients
             *     description: Delete specific client detail
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
             *         description: Return deleted client
             *         schema:
             *           $ref: '#/definitions/client'
             *      400:
             *         description: Bad request
             *      404:
             *         description: cannot find client with the given id
             */
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const client = await Client.findByIdAndRemove(req.params.id)
    if (!client) return res.status(404).send('The client with the given id was not found.')

    res.send(client);
})

export default router;
