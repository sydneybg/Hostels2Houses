'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
};

const { Bookings, Spots, Users } = require('../models');

module.exports = {
  async up (queryInterface, Sequelize) {

    const spots = await Spots.findAll();
    const users = await Users.findAll();

    await Bookings.bulkCreate( [
      {
        spotId: spots[0].id,

      }
    ])
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
