'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
};

const demoSpotImages = [
  {
    spotId: 1,
    url: "www.abc.com",
    preview: true
  },
  {
    spotId: 2,
    url: "www.abcd.com"
  },
  {
    spotId: 3,
    url: "www.bdef.com",
    preview: true
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImage';
    await SpotImage.bulkCreate( demoSpotImages, options)
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImage';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['www.abc.com']}
    }, {})
  }
};
