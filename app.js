const express = require('express');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express(); //object that takes incoming http requests

mongoose.Promise = global.Promise;
if(process.env.NODE_ENV !== 'test'){
    mongoose.connect('mongodb://localhost/muber');
}


//middleware
app.use(bodyParser.json());
routes(app);  //connect routes to app
app.use((err, req, res, next) => {
    res.status(422).send({error: err.message});
}); //handle errors

module.exports = app;