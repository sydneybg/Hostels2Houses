'use strict';

const { Booking, Spot, User } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
};


module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await Bookings.bulkCreate(
      options,
      [
      {
        spotId: 1,
        guestId: 2,
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-10')
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1] }
    }, {})
  }
};
