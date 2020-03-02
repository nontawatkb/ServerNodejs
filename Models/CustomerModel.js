var mongoose = require('mongoose');
var CustomerSchema = new mongoose.Schema({
    No: Number,
    Username: String,
    Password: String,
    CreateDate: Date,
    UpdateDate: Date,
});

mongoose.model('Customer', CustomerSchema);
module.exports = mongoose.model('Customer');