'use strict';

const superagent = require('superagent')
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const tokenUrl = 'https://oauth2.googleapis.com/token';
const userUrl = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=`;
const userModel = require('../models/users');

module.exports = async (req, res, next) => {
    try {
        
        const code = req.query.code;
        const token = await exchangeCodeWithtoken(code);
        const userObj = await exchangeTokenWithInfo(token);
        const user = await localUser(userObj);
        req.userInfo = user[0];
        req.token = user[1];
        next()
    } catch (err) {
        console.log(err.message);
        next('OAuth Middleware Error');
    }
}

async function exchangeCodeWithtoken(code) {
    try {

        const resp = await superagent.post(tokenUrl).send({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code,
            redirect_uri: 'http://localhost:3000/oauth',
            grant_type: 'authorization_code'
        });
        return resp.body.access_token;
    } catch (err) {
        console.log(err.message);
        throw new Error('Exchange With Tocken error');
    }
}
async function exchangeTokenWithInfo(token) {
    try {
        const resp = await superagent.get(userUrl + token).set({
            'Authorization': `Bearer ${token}`
        });
        return resp.body;
    } catch (err) {
        console.log(err.message);
        throw new Error('Exchange Token With Info error')
    }
        
}
async function localUser(userObj) {
    const userInfo = {
        username: userObj.name,
        password: 'password',
        role:'admin'
    }
    try {
        const user = await userModel(userInfo);
        const savedUser = await user.save();
        return [savedUser, savedUser.token];
    } catch (err) {
        console.log(err.message);
        throw new Error('Local User Saving Err')
    }
}