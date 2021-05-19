'use strict';

require('dotenv').config();
const { start } = require('./src/server');
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

// Start up DB Server
const { connect } = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
async function runServer(start) {
  try {
    await connect(MONGODB_URI, options);
    console.log('Connected to the DATABASE');
    // Start the web server
    start(PORT);
  }catch (err) {   
    console.log(err.message, '\nCould not connect to the DataBase');
  }
}
runServer(start);