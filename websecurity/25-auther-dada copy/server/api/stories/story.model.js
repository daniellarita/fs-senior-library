'use strict';

var Sequelize = require('sequelize');
const sanitize = require('sanitize-html');

var db = require('../../_db');

var Story = db.define('story', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  paragraphs: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    defaultValue: [],
    set: function (rawParagraphs) {
      const sanitizedParagraphs = rawParagraphs.map(p => sanitize(p));
      this.setDataValue('paragraphs', sanitizedParagraphs);
    }
  }
}, {
  scopes: {
    populated: () => ({
      include: [{
        model: db.model('user'),
        as: 'author'
      }]
    })
  }
});

module.exports = Story;
