var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/ServerNodjsProject', { useNewUrlParser: true })

mongoose.connection.on('connected', function() {
    console.log('Mongoose default connection open');
});

mongoose.connection.on('error', function(err) {
    console.log('Mongoose default connection error: ' + err);
});