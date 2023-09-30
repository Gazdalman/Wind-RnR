'use strict';

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const demoSpots = [
  {
    ownerId: 1,
    address: "001 Royal Way",
    city: "Royal Capital",
    state: "Noble Realm",
    country: "Clover Kingdom",
    lat: -60,
    lng: 0,
    name: "Royal Palace",
    description: "The home of each of the three noble families, the Wizard King, and the Royal family.",
    price: 9000.00,
  },
  {
    ownerId: 2,
    address: "123 Orphanage Avenue",
    city: "Hage Village",
    state: "Forsaken Realm",
    country: "Clover Kingdom",
    lat: -20.32456,
    lng: 10.56,
    name: "Hage Orphanage",
    description: "We are a humble little church that want to help take care of the forgotten children! HOME OF ASTA AND YUNO!!!!!",
    price: 3.00,
  },
  {
    ownerId: 3,
    address: "Middle of Nowhere",
    city: "Border Lands",
    state: "Forsaken Realm",
    country: "Clover Kingdom",
    lat: -5.9823,
    lng: 2.5,
    name: "Black Bulls' Base",
    description: "Stay out of my digs. I'm only putting this here for the test! - Captain of the Black Bulls, Yami",
    price: .50,
  },
]

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
    await Spot.bulkCreate(demoSpots)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ["Royal Palace","Hage Orphanage","Black Bulls Hideout"] }
    }, {});
  }
};
