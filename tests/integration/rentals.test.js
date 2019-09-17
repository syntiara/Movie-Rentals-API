//for sending http request while testing
const request = require('supertest');
// const moment = require('moment');
const {Rental} = require('../../models/rental');
const {Movie} = require('../../models/movie');
const {User} = require('../../models/user');
const {models, movieId, customerId} = require('../mocks/model');

let server;
let token;
let rental;
let movie;
describe('/api/rentals', () =>{

    beforeEach( async () => {
        server = require('../../index'); 
        rental = new Rental(models.rental);
        movie = new Movie(models.movie);
        await movie.save();
        await rental.save();
    });

    afterEach( async () => {
        await Rental.remove({});
        await Movie.remove({});
        await server.close();
    });
    
    describe('/returns POST/', () =>{
        
        let body;
        const exec = () => {
            return request(server).post(`/api/rentals/returns`)
            .set('x-Auth-Token', token)
            .send(body)
        }

        beforeEach(  () => {
            token = new User(models.userPayload).generateAuthToken();
            body = {customerId, movieId};
        });

        it('should return 401 if client is not logged in', async () =>{
            token = ''
            const res = await exec();
            expect(res.status).toBe(401);
        });
    
        it('should return 403 if client is not an admin', async () =>{
            token = new User().generateAuthToken();
            const res = await exec();
            expect(res.status).toBe(403);
        });

        it('should return 400 if customerId is not provided', async () =>{
            body.customerId = '';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if movieId is not provided', async () =>{
            body.movieId = '';
            const res = await exec();
            expect(res.status).toBe(400);
        });
        

        it('should return 404 if no rental is found for customer/movie id', async () =>{
            await Rental.remove({});
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should return 400 if rental is already processed', async () =>{
            rental.dateReturned = new Date();
            await rental.save();
            const res = await exec();
            expect(res.status).toBe(400);
            expect(res.text).toMatch(/already processed/);
        });

        it('should return 200 for valid and unprocessed request', async () =>{
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('customer');
            expect(res.body).toHaveProperty('movie');
        });

        it('should set the returnDate if input is valid', async () =>{
            const res = await exec();

            const rentalInDb = await Rental.findById(rental._id);
            const diff = new Date() - rentalInDb.dateReturned;
            expect(diff).toBeLessThan(10 * 1000);
        });

        it('should set the rentalFee if input is valid', async () => {
            //you want to be sure the movie has been out for some days
            const res = await exec();  
            expect(res.status).toBe(200);
            expect(Object.keys(res.body)).
            toEqual(expect.arrayContaining(['rentalFee', 'customer', 'movie']));
 
          });
        
        it('should increase the movie stock if input is valid', async () => {
            const res = await exec();

            const movieInDb = await Movie.findById(movieId);
            expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
        });

        it('should have processed rental return in response body', async () => {
            const res = await exec();
            //another way of looking for properties
            expect(Object.keys(res.body)).
            toEqual(expect.arrayContaining(['dateOut', 'dateReturned', 'customer', 'movie']));


        }); 
    
        });
});

        
