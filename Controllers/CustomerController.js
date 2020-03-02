var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../../config');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


var Customer = require('../../../Model/Customer/CustomerModel');

router.post('/signup', function(req, res) {

    Customer.findOne({ CustomerUsername: req.body.CustomerUsername }, function(err, user) {
        if (err) return res.status(500).send({ status: false, msg: 'Error on server.' });
        if (user) return res.status(404).send({ status: false, msg: 'Username has already.' });


        Customer.count({}, function(err2, count) {

            var hashedPassword = bcrypt.hashSync(req.body.CustomerPassword, 8);
            var CodeNumber = Math.floor(1000000 + Math.random() * 9000000);

            Customer.create({
                    CustomerNo: count + 1,
                    CustomerCode: CodeNumber,
                    CustomerUsername: req.body.CustomerUsername,
                    CustomerPassword: hashedPassword,
                    CustomerDisplayName: req.body.CustomerDisplayName,
                    CustomerFristName: null,
                    CustomerLastName: null,
                    CustomerPhoneNo: req.body.CustomerPhoneNo,
                    CustomerLineID: null,
                    CustomerEmail: null,
                    CustomerUserImage: null,
                    CustomerVerifyFarm: false,
                    CustomerIDCardNo: null,
                    CustomerIDCardFrontImage: null,
                    CustomerIDCardBackImage: null,
                    CustomerIDCardStatus: 'uvr',
                    CustomerProvider: 'default',
                    CustomerToken: null,
                    CustomerActive: true,
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

    Customer.findOne({ CustomerUsername: req.body.CustomerUsername }, function(err, user) {
        if (err) return res.status(500).send({ status: false, msg: 'Error on server.' });
        if (!user) return res.status(404).send({ status: false, msg: 'No user found.' });

        var passwordIsValid = bcrypt.compareSync(req.body.CustomerPassword, user.CustomerPassword);
        if (!passwordIsValid) return res.status(401).send({ status: false, msg: 'Password not match' });

        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        var jsonUpdate = {
            CustomerToken: token
        }

        Customer.findByIdAndUpdate(user._id, jsonUpdate, function(err2, user2) {
            if (err2) return res.status(500).send({ status: false, msg: 'Error on server.' });
            if (!user2) return res.status(404).send({ status: false, msg: 'No user found.' });

            res.status(200).send({ status: true, msg: 'success', token: token });
        });


    });

});



router.post('/auth_google', function(req, res) {

    Customer.findOne({ CustomerUsername: req.body.CustomerUsername }, function(err, user) {
        if (err) return res.status(500).send({ status: false, msg: 'Error on server.' });
        if (user) {

            var passwordIsValid = bcrypt.compareSync(req.body.CustomerPassword, user.CustomerPassword);
            if (!passwordIsValid) return res.status(401).send({ status: false, msg: 'Password not match' });

            var token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });

            var jsonUpdate = {
                CustomerToken: token
            }

            Customer.findByIdAndUpdate(user._id, jsonUpdate, function(err2, user2) {
                if (err2) return res.status(500).send({ status: false, msg: 'Error on server.' });
                if (!user2) return res.status(404).send({ status: false, msg: 'No user found.' });

                res.status(200).send({ status: true, msg: 'success', token: token });
            });

        } else {

            Customer.count({}, function(err2, count) {
                var CodeNumber = Math.floor(1000000 + Math.random() * 9000000);

                var hashedPassword = bcrypt.hashSync(req.body.CustomerPassword, 8);
                Customer.create({
                        CustomerNo: count + 1,
                        CustomerCode: CodeNumber,
                        CustomerUsername: req.body.CustomerUsername,
                        CustomerPassword: hashedPassword,
                        CustomerDisplayName: req.body.CustomerDisplayName,
                        CustomerFristName: req.body.CustomerFristName,
                        CustomerLastName: req.body.CustomerLastName,
                        CustomerPhoneNo: req.body.CustomerPhoneNo,
                        CustomerLineID: null,
                        CustomerEmail: req.body.CustomerEmail,
                        CustomerUserImage: req.body.CustomerUserImage,
                        CustomerVerifyFarm: false,
                        CustomerIDCardNo: null,
                        CustomerIDCardFrontImage: null,
                        CustomerIDCardBackImage: null,
                        CustomerIDCardStatus: 'uver',
                        CustomerProvider: req.body.CustomerProvider,
                        CustomerActive: true,
                        CreateDate: Date(),
                        UpdateDate: Date(),
                    },
                    function(err3, user2) {
                        if (err3) return res.status(500).send("There was a problem registering the user.")
                            // create a token
                        var token = jwt.sign({ id: user2._id }, config.secret, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).send({ status: true, msg: 'success', token: token });
                    });

            });
        }
    });
});


router.get('/check_token', function(req, res) {
    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({ status: false, msg: 'No token provided.' });

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ status: false, msg: 'Failed to authenticate token.' });

        res.status(200).send({ status: true, msg: 'success' });
    });
});

router.get('/signout', function(req, res) {

    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({ status: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ status: false, message: 'Failed to authenticate token.' });

        var jsonUpdate = {
            CustomerToken: null
        }

        Customer.findByIdAndUpdate(decoded.id, jsonUpdate, function(err2, user2) {
            if (err2) return res.status(500).send({ status: false, msg: 'Error on server.' });
            if (!user2) return res.status(404).send({ status: false, msg: 'No user found.' });

            res.status(200).send({ status: true, msg: 'success', token: null });
        });


    });

});



// add this to the bottom of AuthController.js
module.exports = router;