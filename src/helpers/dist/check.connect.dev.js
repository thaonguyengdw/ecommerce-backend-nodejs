'use strict';

var mongoose = require('mongoose');

var os = require('os');

var process = require('process');

var _SECONDS = 5000; //count Connect

var countConnect = function countConnect() {
  var numConnection = mongoose.connections.length;
  console.log("Number of connections::".concat(numConnection));
}; //check over load


var checkOverLoad = function checkOverLoad() {
  setInterval(function () {
    var numConnection = mongoose.connections.length;
    var numCores = os.cpus().length;
    var memoryUsage = process.memoryUsage().rss; // Example maximum number of connections base on number of cores

    var maxConnections = numCores * 5; // console.log(`Active connections::${numConnection}`)
    // console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`)

    if (numConnection > maxConnections) {
      console.log("Connection overload detected!"); //notify.send(....)
    }
  }, _SECONDS); // Monitor every 5 seconds
};

module.exports = {
  countConnect: countConnect,
  checkOverLoad: checkOverLoad
};