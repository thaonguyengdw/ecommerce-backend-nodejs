"use strict";

require('dotenv').config();

var compression = require('compression');

var express = require('express');

var _require = require('helmet'),
    helmet = _require["default"];

var morgan = require('morgan');

var app = express(); // init middleware

app.use(morgan("dev"));
app.use(helmet());
app.use(compression()); // init db

require('./src/dbs/init.mongodb');

var _require2 = require('./src/helpers/check.connect'),
    checkOverLoad = _require2.checkOverLoad;

checkOverLoad(); // init routes
// handling error

module.exports = app;