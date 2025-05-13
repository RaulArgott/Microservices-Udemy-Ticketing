import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {
    const cookie = await global.signin();
    
    if (!cookie) {
        throw new Error("Expected cookie but got undefined.");
    }
    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send({})
        .expect(200);

    expect(response.body.currentUser.email).toEqual('hYq9C@example.com');

});

it('responds with null if not authenticated', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send({})
        .expect(401);
});