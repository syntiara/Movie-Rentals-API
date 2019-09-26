import swaggerUI from 'swagger-ui-express';
import swaggerSpec from '../routes/home';
import express from 'express';
import genreRoute from '../routes/genres';
import clientRoute from '../routes/clients';
import movieRoute from '../routes/movies';
import rentalRoute from '../routes/rentals';
import userRoute from '../routes/users';
import authRoute from '../routes/auth';

//installs a middleware function in the request processing pipeline. Middleware function are called in sequence
export default app => {
app.use(express.json())
app.use('/api/genres', genreRoute); //append "/api/genres" to any route using genreRoute
app.use('/api/clients', clientRoute);
app.use('/api/movies', movieRoute);
app.use('/api/rentals', rentalRoute);
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
}
