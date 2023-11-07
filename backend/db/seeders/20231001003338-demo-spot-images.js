'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const demoImages = [
  {
    spotId: 1,
    url: "https://static.wikia.nocookie.net/bcfanon/images/a/ad/Black-Clover-107_05.35_2019.10.29_13.09.33_stitch.jpg/revision/latest?cb=20230625062208",
    preview: false
  },
  {
    spotId: 1,
    url: "https://animesolution.com/wp-content/uploads/2020/04/Black-Clover-130_02.11_2020.04.14_11.36.27_stitch.jpg",
    preview: true
  },
  {
    spotId: 2,
    url: "https://static.wikia.nocookie.net/blackstar/images/2/21/Hage_orphanage_church.png/revision/latest/scale-to-width-down/250?cb=20171006185817",
    preview: false
  },
  {
    spotId: 2,
    url: "https://animesolution.com/wp-content/uploads/2017/10/Black-Clover-03_14.15_2017.10.17_09.18.23_stitch.jpg",
    preview: true
  },
  {
    spotId: 3,
    url: "https://pm1.aminoapps.com/7801/117769cbe0a88215a31b5aa1c1a498641b63346ar4-740-370_00.jpg",
    preview: false
  },
  {
    spotId: 3,
    url: "https://pbs.twimg.com/media/DNNQxSkVQAA1hpM.jpg",
    preview: true
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
   await SpotImage.bulkCreate(demoImages, { validate: true })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1,2,3] }
    }, {});
  }
};
