'use strict';

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
};

const demoBookings = [
      {
        spotId: 1,
        guestId: 1,
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-10')
      },
      {
        spotId: 2,
        guestId: 2,
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-04-10')
      },
      {
        spotId: 3,
        guestId: 3,
        startDate: new Date('2025-08-01'),
        endDate: new Date('2025-08-10')
      }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // options.tableName = 'Bookings';
    await Booking.bulkCreate(demoBookings, options);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,
      { [Op.or]: demoBookings}, {});
  }
};
