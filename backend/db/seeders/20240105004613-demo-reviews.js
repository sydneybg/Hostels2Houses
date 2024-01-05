'use strict';

const { Review, User, Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
};


module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await Review.bulkCreate(
      options,
      [
        {
          spotId: 1,
          userId: 1,
          stars: 4,
          body: 'Not too bad'
        }
      ]
    )
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      stars: { [Op.in]: [4] }
    }, {})
  }
};
