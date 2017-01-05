'use strict';

var app = require('./app');
var db = require('./db');
var fs = require('fs');
var https = require('https');

var port = 8443;
const credentials = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
var server = https.createServer(credentials, app);

server.listen(port, function (err) {
  if (err) throw err;
  console.log('HTTPS server patiently listening on port', port);
  db.sync()
  .then(function () {
    console.log('Oh and btw the postgres server is totally connected, too');
  });
});

module.exports = server;
