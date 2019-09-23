import bcrypt from 'bcrypt';
import  _ from 'lodash';
import {User, validate} from '../models/user';  //object destructuring
import {validateObjectId, requestValidator} from '../middleware/validation';
import auth from '../middleware/auth';
import express from 'express';

const router = express.Router();

  /**
     * @swagger
     * definition:
     *   inputUser:
     *     properties:
     *       name:
     *         type: string
     *       email:
     *         type: string
     *         format: email
     *         description: Email for the user, needs to be unique.
     *       password:
     *         type: string
     *         description: password should be strong.
     */

       /**
     * @swagger
     * definition:
     *   outputUser:
     *     properties:
     *       id:
     *        type: string
     *        description: user id.
     *       name:
     *         type: string
     *       email:
     *         type: string
     *         format: email
     */
    

/**
         * @swagger
         * /users:
         *   post:
         *     tags:
         *       - Users
         *     description: create new user
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: user
         *         description: User object
         *         in: body
         *         required: true
         *         schema:
         *           $ref: '#/definitions/inputUser'
         *     responses:
         *       200:
         *         description: Return created user
         *         schema:
         *           $ref: '#/definitions/outputUser'
         *       400:
         *         description: Bad request
         */
router.post('/', requestValidator(validate), async (req, res) => {
    try {

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

 /**
         * @swagger
         * /users/me:
         *   get:
         *     tags:
         *       - Users
         *     description: Get specific user by token
         *     security:
         *       - bearerAuth: []
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: Return user details
         *         schema:
         *           $ref: '#/definitions/outputUser'

*/
//the route is named '/me' beacuse I don't want to expose the id of the user
//I can get it from jwt web token
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
})

  /**
             * @swagger
             * /users/{id}:
             *   put:
             *     tags:
             *       - Users
             *     description: Update specific user detail
             *     security:
             *       - bearerAuth: []
             *     produces:
             *       - application/json
	     *     parameters:
	     *       - name: name
	     *         description: user's name
	     *         in: body
	     *         required: true
         *         type: string
             *      
             *     responses:
             *       200:
             *         description: Return update user details 
             *         schema:
             *           $ref: '#/definitions/outputUser'
             *       400:
             *         description: Bad request
             *       404:
             *         description: cannot find user with the given id
             *         schema:
*/
router.put('/', [auth, validateObjectId, requestValidator(validate)], async (req, res) => {

    const user = await User.findByIdAndUpdate(req.user._id, { name: req.body.name }, { new: true })
    if (!user) return res.status(404).send('The user with the given id was not found.')

    res.send(_.pick(user, ['_id', 'name', 'email']));
})

/**
             * @swagger
             * /users/{id}:
             *   delete:
             *     tags:
             *       - Users
             *     description: Delete specific user detail
             *     security:
             *       - bearerAuth: []
             *     produces:
             *       - application/json
             *     responses:
             *       200:
             *         description: Return deleted user details
             *         schema:
             *           $ref: '#/definitions/outputUser'
             *       404:
             *         description: cannot find user with the given id
             */
router.delete('/', [auth, validateObjectId], async (req, res) => {
    const user = await User.findByIdAndRemove(req.user._id)
    if (!user) return res.status(404).send('The user with the given id was not found.')

    res.send(_.pick(user, ['_id', 'name', 'email']));
})

export default router;
