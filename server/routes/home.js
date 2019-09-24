import swaggerJSDoc from 'swagger-jsdoc';
import express from 'express';

const router = express.Router();


const swaggerDefinition = {
    info: {
      title: 'Movie Rental Swagger API',
      version: '1.0.0',
      description: 'Endpoints to test the movie rental routes',
    },
    components: {},
    host: 'localhost:50300',
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
    apis: ['./routes/*.js'],
  };
  // initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

  router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });


export default swaggerSpec
