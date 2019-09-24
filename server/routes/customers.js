import {Customer, validate} from '../models/customer';  //object destructuring
import {validateObjectId, requestValidator} from '../middleware/validation';
import auth from '../middleware/auth';
import express from 'express';
const router = express.Router();

  /**
     * @swagger
     * definition:
     *   Customer:
     *     properties:
     *       name:
     *         type: string
     *       isGold:
     *         type: boolean
     *         description: for premium customers
     *       phone:
     *         type: string
     *         description: valid phone number
     */

/**
         * @swagger
         * /customers:
         *   post:
         *     tags:
         *       - Customers
         *     description: create new customer
         *     security:
         *       - bearerAuth: []
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: customer
         *         description: customer object
         *         in: body
         *         required: true
         *         schema:
         *           $ref: '#/definitions/Customer'
         *     responses:
         *       200:
         *         description: Return created customer
         *         schema:
         *           $ref: '#/definitions/Customer'
         *       400:
         *         description: Bad request
         *       403:
         *         description: unauthorized
         */
        router.post('/', [auth, requestValidator(validate)], async (req, res) => {
    try {
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

 /**
         * @swagger
         * /customers:
         *   get:
         *     tags:
         *       - Customers
         *     description: Get all customers
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: Return existing customer
         *         schema:
         *           $ref: '#/definitions/Customer'
*/
router.get('/', async (req, res) => {
    const customer = await Customer.find().sort({ name: 1 })
    res.send(customer);
})

 /**
         * @swagger
         * /customers/{id}:
         *   get:
         *     tags:
         *       - Customers
         *     description: Get specific customer details
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
         *     responses:
         *       200:
         *         description: Return specific customer details
         *         schema:
         *           $ref: '#/definitions/Customer'
         *       404:
         *         description: cannot find customer with the given id
 */
router.get('/:id', validateObjectId,  async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(404).send('The customer with the given id was not found.')

    res.send(customer);
})

/**
         * @swagger
         * /customers/{id}:
         *   post:
         *     tags:
         *       - Customers
         *     description: Update specific customer details
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
         *         type: string
         *     responses:
         *       200:
         *         description: Return updated customer
         *         schema:
         *           $ref: '#/definitions/Customer'
         *       400:
         *         description: Bad request
         *       403:
         *         description: unauthorized
         *       404:
         *         description: cannot find customer with the given id
 */
router.put('/:id', [auth, validateObjectId, requestValidator(validate)], async (req, res) => {

    const customer = await Customer.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
    if (!customer) return res.status(404).send('The customer with the given id was not found.')

    res.send(customer);
})

/**
             * @swagger
             * /customers/{id}:
             *   delete:
             *     tags:
             *       - Customers
             *     description: Delete specific customer detail
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
             *         description: Return deleted customer
             *         schema:
             *           $ref: '#/definitions/Customer'
             *      400:
             *         description: Bad request
             *      404:
             *         description: cannot find customer with the given id
             */
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id)
    if (!customer) return res.status(404).send('The customer with the given id was not found.')

    res.send(customer);
})

export default router;
