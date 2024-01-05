'use strict';

const { Review, ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
};


module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate(
      options,
      [
        {
          reviewId: 1,
          url: "www.abc.com"
        }
      ]
    )
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['www.abc.com'] }
    }, {})
  }
};
