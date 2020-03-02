const bodyParser = require('body-parser');
var express = require('express');
var app = express();
var db = require('./db');
var cors = require('cors');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type, x-access-token');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next()
});
app.use(cors());

//API FOR MainSystem
var APICustomer = require('./Controllers/CustomerController');
app.use('/api/customer', APICustomer);




module.exports = app;