import request from 'supertest';
import {User} from '../../models/user';
import {Genre} from '../../models/genre';
import app from '../../index';
let server;

describe('auth middleware', () =>{
   
    beforeEach( () => {
        server = app;
        token = new User().generateAuthToken();
    });

    afterEach(async () => {
        await Genre.remove({});
        await server.close();
    });

    let token;
    const exec = () => {
        return  request(server).post(`/api/genres`)
        .set('x-Auth-Token', token)
        .send({name: 'genre8'})
    }

    it('should return 401 if no token is provided', async () =>{
        token = ''
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async () =>{
        token = 'dra'
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async () =>{
        const res = await exec();
        expect(res.status).toBe(201);
    });
});
