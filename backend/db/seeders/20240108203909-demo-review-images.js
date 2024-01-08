'use strict';

const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
};

const demoReviewImages = [
  {
    reviewId: 1,
    url: 'https://image1.jpg'
  },
  {
    reviewId: 2,
    url: 'https://image2.jpg'
  },
  {
    reviewId: 3,
    url: 'https://image3.jpg'
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await ReviewImage.bulkCreate( demoReviewImages, options)
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['www.abc.com'] }
    }, {})
  }
};
