'use strict';

const superagent = require('superagent')
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const oauthURL = 'https://www.googleapis.com/auth/gmail.labels';

module.exports = async (req, res, next)=>{
}

async function getCodeFromOAuth() {
    try {
        
        //get request and recieve code
        const res = await superagent.get(oauthURL);
        // Get the code from the body
        // const code = res.body
        console.log(res.body);
    } catch (er) {
        console.log(er.message);
    }

}
