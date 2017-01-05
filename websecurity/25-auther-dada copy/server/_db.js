'use strict';

var Sequelize = require('sequelize');

var secrets = require('../secrets');

var databaseURI = secrets.dbURI;

var db = new Sequelize(databaseURI, {
  define: {
    timestamps: false,
    underscored: true
  },
  logging: false
});

module.exports = db;
