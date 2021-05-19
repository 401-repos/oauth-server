"use strict";

process.env.SECRET = "toes";

const test = require("@code-fellows/supergoose");
const {
    app,
    start
} = require("../src/server.js");
const testServer = test(app);
const Users = require('../src/auth/models/users.js');


let users = {
    admin: {
        username: "admin",
        password: "password",
        role: "admin",
    },
    editor: {
        username: "editor",
        password: "password",
        role: "editor",
    },
    user: {
        username: "user",
        password: "password",
        role: "user",
    },
    writer: {
        username: "writer",
        password: "password",
        role: "writer",
    },
};

describe('Testing server', () => {

    let spyCons;
    let spyListen;
    let token;
    let id;
    beforeEach(() => {
        spyCons = jest.spyOn(console, 'log').mockImplementation();
        spyListen = jest.spyOn(app, 'listen').mockImplementation();
    });
    afterEach(() => {
        spyCons.mockRestore();
        spyListen.mockRestore();
    });
    beforeAll(async (done) => {
        const record = await new Users(users.admin).save();
        await testServer.post('/signup').send(users['admin']);
        const resp = await testServer.post('/signin')
        .auth(users['admin'].username, users['admin'].password);
        token = resp.body.token;
        id = record._id;
        done();
    });
    it('should give status of 404 if route does not exsists', async () => {
        const test404 = await testServer.get('/bad');
        expect(test404.status).toEqual(404);
    });
    it('should give status of 201 new food created', async () => {
        await testServer.post('/signup').send(users['admin']);
        const resp = await testServer.post('/signin')
            .auth(users['admin'].username, users['admin'].password);
        const token = resp.body.token;
        const test201 = await testServer.post('/api/v2/food')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "Desiert",
                calories: 50,
                type: "VEGETABLE"
            });
        expect(test201.status).toEqual(201);
    });
    it('should give status of 201 new food created', async () => {
        await testServer.post('/signup').send(users['admin']);
        const resp = await testServer.post('/signin')
            .auth(users['admin'].username, users['admin'].password);
        const token = resp.body.token;
        const test201 = await testServer.post('/api/v2/clothes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "bantaloon",
                color: 'red',
                size: "small"
            });
        expect(test201.status).toEqual(201);
    });
    it('should give status of 404 if bad method', async () => {
        const test404 = await testServer.put('/');
        expect(test404.status).toEqual(404);
    });
    it('should give status of 200 if read clothes succeeded', async () => {
        const test200 = await testServer.get('/api/v2/clothes').set('Authorization', `Bearer ${token}`);
        expect(test200.status).toEqual(200);
    });
    it('should give status of 200 if read food succeeded', async () => {
        const test200 = await testServer.get('/api/v2/food').set('Authorization', `Bearer ${token}`);
        expect(test200.status).toEqual(200);
    });
    it('should give status of 204 if updated food succeeded', async () => {
        const test204 = await testServer.put(`/api/v2/clothes/${id}`).set('Authorization', `Bearer ${token}`)
            .send({
                name: "carrots",
                color: "Color orange"
            });
        expect(test204.status).toEqual(204);
    });
    it('should give status of 204 if updated clothes succeeded', async () => {
        const test204 = await testServer.put(`/api/v2/food/${id}`).send({
            name: "underwear",
            calories: 2
        }).set('Authorization', `Bearer ${token}`);
        expect(test204.status).toEqual(204);
    });
    it('should give status of 204 if deleting food succeeded', async () => {
        const test204 = await testServer.delete(`/api/v2/food/${id}`).set('Authorization', `Bearer ${token}`);
        expect(test204.status).toEqual(204);
    });
    it('should give status of 204 if deleting clothes succeeded', async () => {
        const test204 = await testServer.delete(`/api/v2/food/${id}`).set('Authorization', `Bearer ${token}`);
        expect(test204.status).toEqual(204);
    });
    it('should give status of 200 if read clothes with id succeeded', async () => {
        const test200 = await testServer.get('/api/v2/food/' + id).set('Authorization', `Bearer ${token}`);
        expect(test200.status).toEqual(200);
    });
    it('should give status of 200 if read food with id succeeded', async () => {
        const test200 = await testServer.get('/api/v2/food/' + id).set('Authorization', `Bearer ${token}`);
        expect(test200.status).toEqual(200);
    });

    it('should give status of 200 if route success of home', async () => {
        const testSuccess = await testServer.get('/');
        expect(testSuccess.status).toEqual(200);
    });
    it('should tell the function has been called', () => {
        const port = 0;
        start(port);
        expect(spyListen).toHaveBeenCalled();
    });

});