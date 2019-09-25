import swaggerJSDoc from 'swagger-jsdoc';
import express from 'express';
import {host} from '../config'

const router = express.Router();


const swaggerDefinition = {
    info: {
      title: 'Movie Rental Swagger API',
      version: '1.0.0',
      description: 'Endpoints to test the movie rental routes',
    },
    components: {},
    host: host,
    basePath: '/api',
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'x-auth-token',
        in: 'header',
      },
    },
  };
  
  // options for the swagger docs
  const options = {
    swaggerDefinition,
    apis: ['./server/routes/*.js'],
  };
  // initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

  router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });


export default swaggerSpec
