var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var Customer = require('../Models/CustomerModel');

router.post('/signup', function(req, res) {

    Customer.findOne({ Username: req.body.Username }, function(err, user) {
        if (err) return res.status(500).send({ status: false, msg: 'Error on server.' });
        if (user) return res.status(404).send({ status: false, msg: 'Username has already.' });

        Customer.count({}, function(err2, count) {

            var hashedPassword = bcrypt.hashSync(req.body.Password, 8);

            Customer.create({
                    No: count + 1,
                    Username: req.body.Username,
                    Password: hashedPassword,
                    CreateDate: Date(),
                    UpdateDate: Date(),
                },
                function(err3, user3) {
                    if (err3) return res.status(500).send("There was a problem registering the user.")

                    res.status(200).send({ status: true, msg: 'success' });
                });
        });
    });
});


router.post('/signin', function(req, res) {

    Customer.findOne({ Username: req.body.Username }, function(err, user) {
        if (err) return res.status(500).send({ status: false, msg: 'Error on server.' });
        if (!user) return res.status(404).send({ status: false, msg: 'No user found.' });

        var passwordIsValid = bcrypt.compareSync(req.body.Password, user.Password);
        if (!passwordIsValid) return res.status(401).send({ status: false, msg: 'Password not match' });

        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ status: true, msg: 'success', token: token });
    });

});


// add this to the bottom of AuthController.js
module.exports = router;