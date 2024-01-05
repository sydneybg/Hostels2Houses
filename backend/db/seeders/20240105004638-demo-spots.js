'use strict';

const { User, Spot, sequelize } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   options.tableName = 'Spots';
   await Spot.bulkCreate(
     options,
     [
       {
         ownerId: 1,
         address: '123 Road',
         ciy: 'Seatte',
         state: 'Washington',
         country: 'USA',
         lat: 47.608013,
         lng: -122.335167,
         name: "blue house",
         description: 'a blue house',
         price: 1000.00
       }
     ],
     { validate: true }
   );

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['blue house'] }
    }, {})
  }
};
