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
var MSAuth = require('./Mainsystem/Controller/Auth/AuthController');
app.use('/api/ms/auth', MSAuth);

var MSCustomer = require('./Mainsystem/Controller/Customer/CustomerController');
app.use('/api/ms/customer', MSCustomer);

var MSReport = require('./Mainsystem/Controller/Report/ReportController');
app.use('/api/ms/report', MSReport);

var MSArticle = require('./Mainsystem/Controller/Article/ArticleController');
app.use('/api/ms/article', MSArticle);

var MSShare = require('./Mainsystem/Controller/Share/ShareController');
app.use('/api/ms/share', MSShare);



//API FOR Backofiice
var BOAuth = require('./Backoffice/Controller/Auth/AuthController');
app.use('/api/bo/auth', BOAuth);

var BOAdmin = require('./Backoffice/Controller/Admin/AdminController');
app.use('/api/bo/admin', BOAdmin);

var BOArticle = require('./Backoffice/Controller/Article/ArticleController');
app.use('/api/bo/article', BOArticle);

var BOShare = require('./Backoffice/Controller/Share/ShareContoller');
app.use('/api/bo/share', BOShare);

// app.js
// var AuthController = require('./auth/AuthController');
// app.use('/api/auth', AuthController);

// var AreaController = require('./area/AreaController');
// app.use('/api/area', AreaController);

// var TasksController = require('./tasks/TasksController');
// app.use('/api/tasks', TasksController);

// app.use('/public/images/', express.static('./public/images'));

app.use('/public/images/', express.static('./public/images'));

module.exports = app;