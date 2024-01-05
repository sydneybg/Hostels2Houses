'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/* @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo1@user.io',
        username: 'Demo1',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Sydney',
        lastName: 'Barnes'
      },
      {
        email: 'user1@user.io',
        username: 'Demo2',
        hashedPassword: bcrypt.hashSync('password1'),
        firstName: 'Barnes',
        lastName: 'Grant'
      },
      {
        email: 'user2@user.io',
        username: 'Demo3',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: 'Elise',
        lastName: 'OBrien'
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo1', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
