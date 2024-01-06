// 'use strict';

// const { Booking, Spot, User } = require('../models');

// let options = {};
// if (process.env.NODE_ENV === 'production') {
//   options.schema = process.env.SCHEMA;
// };


// module.exports = {
//   async up (queryInterface, Sequelize) {
//     options.tableName = 'Bookings';
//     await Booking.bulkCreate(
//       [
//       {
//         spotId: 1,
//         guestId: 1,
//         startDate: new Date('2025-06-01'),
//         endDate: new Date('2025-06-10')
//       }
//     ], options);
//   },

//   async down (queryInterface, Sequelize) {
//     options.tableName = 'Bookings';
//     const Op = Sequelize.Op;
//     return queryInterface.bulkDelete(options, {
//       id: { [Op.gt]: 0 }
//     });
//   }
// };


'use strict';

const { Booking } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await Booking.bulkCreate(options,
    [
      {
        spotId: 1,
        userId: 1,
        startDate: '2025-01-01',
        endDate: '2025-01-03'
      },


    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      startDate: { [Op.in]: ['2022-01-01']}
    }, {})
  }
};
