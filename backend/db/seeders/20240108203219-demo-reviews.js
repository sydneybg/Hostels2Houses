'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
};

const demoReviews = [
  {
    spotId: 1,
    authorId: 1,
    stars: 4,
    body: 'Not too bad'
  },
  {
    spotId: 2,
    authorId: 2,
    stars: 3,
    body: 'Ruggedddd'
  },
  {
    spotId: 3,
    authorId: 3,
    stars: 5,
    body: 'Incredible location by the beach'
  },
  {
    spotId: 4,
    authorId: 4,
    stars: 3,
    body: 'Small but cozy place for the price'
  },
  {
    spotId: 5,
    authorId: 5,
    stars: 4,
    body: 'Beautiful mountain views but kitchen appliances could use an upgrade'
  },
  {
    spotId: 6,
    authorId: 6,
    stars: 5,
    body: 'Bright and spacious home in a perfect beach town location'
  },
  {
    spotId: 1,
    authorId: 7,
    stars: 5,
    body: 'Josh was a wonderful host, very welcoming and responsive'
  },
  {
    spotId: 2,
    authorId: 8,
    stars: 2,
    body: 'No wifi and very noisy neighbors, not ideal for a business trip'
  },
  {
    spotId: 3,
    authorId: 9,
    stars: 3,
    body: 'Great beachside spot but had some issues with ants in the kitchen'
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await Review.bulkCreate(demoReviews, options)
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,
      { [Op.or]: demoReviews }, {})
  }
};
