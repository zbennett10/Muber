const express = require('express');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express(); //object that takes incoming http requests

mongoose.connect('mongodb://localhost/muber');

//middleware
app.use(bodyParser.json());

//connect routes to app
routes(app);

module.exports = app;