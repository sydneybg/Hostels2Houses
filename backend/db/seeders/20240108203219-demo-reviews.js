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
