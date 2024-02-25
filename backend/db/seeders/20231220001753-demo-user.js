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
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Sydney',
        lastName: 'Barnes'
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password1'),
        firstName: 'Barnes',
        lastName: 'Grant'
      },
      {
        email: 'demouser2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: 'Elise',
        lastName: 'OBrien'
      },
      {
        email: 'user3@user.io',
        username: 'FakeUser3',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: 'Mark',
        lastName: 'Burg'
      },
      {
        email: 'user4@seeds.io',
        username: 'SeedUser4',
        hashedPassword: bcrypt.hashSync('seedpassword4'),
        firstName: 'Mary',
        lastName: 'Lewis'
      },
      {
        email: 'fakeuser5@example.com',
        username: 'SeededUser5',
        hashedPassword: bcrypt.hashSync('fakepass5'),
        firstName: 'Michelle',
        lastName: 'Peters'
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-Lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
