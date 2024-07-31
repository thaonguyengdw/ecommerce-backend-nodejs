'use strict';

var express = require('express');

var accessController = require('../../controllers/access.controller');

var router = express.Router(); //sign up

router.post('/shop/signup', accessController.signUp);
module.exports = router;