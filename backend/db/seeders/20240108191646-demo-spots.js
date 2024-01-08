'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

//spots
const demoSpots = [
  {
    ownerId: 1,
    address: '123 Road',
    city: 'Seattle',
    state: 'Washington',
    country: 'USA',
    lat: 47.608013,
    lng: -122.335167,
    name: 'blue house',
    description: 'a very blue house',
    price: 1000.00
  },
  {
   ownerId: 2,
   address: '1234 Frog Street',
   city: 'Portland',
   state: 'Oregon',
   country: 'USA',
   lat: 45.523064,
   lng: -122.676483,
   name: 'pink house',
   description: 'a super pink house',
   price: 459.00
 },
 {
  ownerId: 3,
  address: '234 Fox Lane',
  city: 'Sayulita',
  state: 'Nayarit',
  country: 'Mexico',
  lat: 20.8691,
  lng: 105.4410,
  name: 'iguana house',
  description: 'gorgeous apartment on the beach',
  price: 266.00
}
]


/* @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await Spot.bulkCreate(demoSpots, options)
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,
      { name: { [Op.in]: ['blue house'] }
    }, {})
  }
};
