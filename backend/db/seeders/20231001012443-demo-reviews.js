'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const demoReviews = [
  {
    spotId: 1,
    userId: 2,
    review: "I'm going to be the one living there Asta.",
    stars: 4
  },
  {
    spotId: 1,
    userId: 3,
    review: "Eh. Too gaudy for my tastes.",
    stars: 1
  },
  {
    spotId: 2,
    userId: 1,
    review: "I WAS SO HAPPY TO SEE SISTER LILY AGAIN!!!!",
    stars: 5
  },
  {
    spotId: 2,
    userId: 3,
    review: "Surprised Asta and Mr. Golden Dawn came from here.",
    stars: 4
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
   await Review.bulkCreate(demoReviews);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
