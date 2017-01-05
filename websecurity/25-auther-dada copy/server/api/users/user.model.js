'use strict';

var Sequelize = require('sequelize');

var db = require('../../_db');
var crypto = require('crypto');

var User = db.define('user', {
  name: Sequelize.STRING,
  photo: {
    type: Sequelize.STRING,
    defaultValue: '/images/default-photo.jpg'
  },
  phone: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    set: function (plaintext) {
      this.setDataValue('password', this.hashPassword(plaintext));
    }
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  googleId: Sequelize.STRING,
  githubId: Sequelize.STRING,
  twitterId: Sequelize.STRING,
  salt: {
    type: Sequelize.STRING,
    defaultValue: function () {
      return crypto.randomBytes(16).toString('base64');
    }
  }
}, {
  defaultScope: {
    attributes: {exclude: ['password', 'salt']}
  },
  instanceMethods: {
    hashPassword: function (plaintext) {
      return crypto.pbkdf2Sync(plaintext, this.salt, 10000, 64).toString('base64');
    },
    isPasswordValid: function (attempt) {
      return this.hashPassword(attempt) === this.password;
    }
  },
  scopes: {
    populated: () => ({
      include: [{
        model: db.model('story'),
        attributes: {exclude: ['paragraphs']}
      }]
    })
  }
});

module.exports = User;
