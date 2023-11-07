'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await User.bulkCreate([
    {
      username: 'FutRWizKing',
      email: 'asta@user.io',
      firstName: 'Asta',
      lastName: 'N/A',
      hashedPassword: bcrypt.hashSync('password'),
    },
    {
      username: 'theRLFutRWK',
      email: 'yuno@user.io',
      firstName: 'Yuno',
      lastName: 'N/A',
      hashedPassword: bcrypt.hashSync('password2'),
    },
    {
      username: 'ShadwCap',
      email: 'yami@user.io',
      firstName: 'Yami',
      lastName: 'Sukehiro',
      hashedPassword: bcrypt.hashSync('password3'),
    },
    {
      username: 'FoodieQueen',
      email: 'charmy@user.io',
      firstName: 'Charmy',
      lastName: 'Pappitson',
      hashedPassword: bcrypt.hashSync('password123')
    },
    {
      username: 'TheGreatestMage',
      email: 'sekke@user.io',
      firstName: 'Sekke',
      lastName: 'Bronzazza',
      hashedPassword: bcrypt.hashSync('password234')
    },
    {
      username: 'RoylWaterWitch',
      email: 'noelle@user.io',
      firstName: 'Noelle',
      lastName: 'Silva',
      hashedPassword: bcrypt.hashSync('password345')
    }
   ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['FutRWizKing','theRLFutRWK','ShadwCap'] }
    }, {});
  }
};
