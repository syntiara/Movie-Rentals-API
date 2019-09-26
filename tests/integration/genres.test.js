//for sending http request while testing
import request from 'supertest';
import {User} from '../../server/models/user';
import {Genre} from '../../server/models/genre';
import {models} from '../mocks/model';
import app from '../../server/index';

let server;
let genre;

describe('/api/genres', () =>{
    beforeEach( async () => {
        server = app;
        genre = await Genre.collection.insertMany(models.genres);

    });

    afterEach(async () => {
        await Genre.remove({});
        await server.close();
    });

    describe('GET /', () =>{
    it('should return all genres record', async () =>{
        const res = await request(server).get('/api/genres');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(5);
        expect(res.body.some(g => g.name === 'Genre1')).toBeTruthy();
    });
});
    describe('GET /:id', () =>{
    it('should return genre for a valid id', async () =>{
        const res = await request(server).get(`/api/genres/${genre.ops[0]._id}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', genre.ops[0].name);
    });

    it('should return error message if an invalid id was sent', async () =>{
        const res = await request(server).get(`/api/genres/5`);
        expect(res.status).toBe(400);
    });

    it('should return error message if the id does not exist', async () =>{
        const res = await request(server).get(`/api/genres/5d8704a8b63b7d806c072e6d`);
        expect(res.status).toBe(404);
        // expect(res.statusText).toBe('The genre with the given id was not found.');
    });

    });

    describe('POST /', () =>{
        let token;
        let name;

        const exec = () => {
            return request(server).post(`/api/genres`)
            .set('x-Auth-Token', token)
            .send({name})
        }

        beforeEach(  () => {
            token = new User().generateAuthToken();
            name = 'Genre6';
        });
    
        it('should return 401 if client is not logged in', async () =>{
            token = ''
            const res = await exec();
            expect(res.status).toBe(401);
        });
    
        it('should return 400 if invalid genre is less than 5 characters', async () =>{
            name = 'gen';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if invalid genre is more than 50 characters', async () =>{
             name = new Array(25).join('genre67');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 200 and genre if genre is valid', async () =>{
            const res = await exec();
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', name);
        });
    
        });
});

        
