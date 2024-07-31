"use strict";

var app = require("./src/app");

var PORT = process.env.PORT || 3056;
var server = app.listen(PORT, function () {
  console.log("WSV eCommerse stars with ".concat(PORT));
}); // process.on('SIGINT', () => {
//     server.close( () => console.log(`Exit Server Express`))
//     // notify.send( ping... )
// })