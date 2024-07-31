'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var mongoose = require('mongoose');

var _require = require('../configs/config.mongodb'),
    _require$db = _require.db,
    host = _require$db.host,
    name = _require$db.name,
    port = _require$db.port; // const connectionString = `mongodb+srv://thaonguyengdw:19N1I4EDlCElK6Nf@cluster0.aaaww90.mongodb.net/`


var connectionString = "mongodb://".concat(host, ":").concat(port, "/").concat(name);

var _require2 = require('../helpers/check.connect'),
    countConnect = _require2.countConnect;

console.log("connectionString:", connectionString);

var Database =
/*#__PURE__*/
function () {
  function Database() {
    _classCallCheck(this, Database);

    this.connect();
  }

  _createClass(Database, [{
    key: "connect",
    value: function connect() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'mongodb';
      mongoose.connect(connectionString, {
        maxPoolSize: 50
      }).then(function (_) {
        console.log("Connected Mongodb Success PRO", countConnect());
      })["catch"](function (err) {
        return console.log("Error Connect!");
      });

      if (1 === 1) {
        mongoose.set('debug', true);
        mongoose.set('debug', {
          color: true
        });
      }
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      if (!Database.instance) {
        Database.instance = new Database();
      }

      return Database.instance;
    }
  }]);

  return Database;
}();

var instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;