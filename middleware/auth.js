import jwt from 'jsonwebtoken';
import { secretKey } from '../config';

export default (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided');

    //if token exist in header, verify if it's valid
    try {
        const decode = jwt.verify(token, secretKey);
        req.user = decode;

        next();

    }
    catch (err) {
        res.status(400).send('Invalid token');
    }
} 