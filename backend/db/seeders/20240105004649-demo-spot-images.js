'use strict';

const { Spot, SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
};


module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate(
      options,
      [
        {
          spotId: 1,
          url: "www.abc.com",
          preview: true
        }
      ]
    )
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImage';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['www.abc.com']}
    }, {})
  }
};
