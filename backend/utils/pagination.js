const { Op } = require('sequelize')
const paginationCheck = async (req, _res, next) => {
  let { page, size } = req.query;
  const { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
  let lowerLat = minLat != undefined ? minLat : -90;
  let upperLat = maxLat != undefined ? maxLat : 90;
  let lowerLng = minLng != undefined ? minLng : -180;
  let upperLng = maxLng != undefined ? maxLng : 180;
  let lowerPrice = minPrice != undefined ? minPrice : 0;
  let upperPrice = maxPrice != undefined ? maxPrice : Infinity;

  const pag = {};

  if (page > 10) page = 10;
  if (size > 20 || !size) size = 20;

  pag.limit = size;
  pag.offset = page ? size * (page - 1) : 0

  // if (minLat) {
  //   lowerLat = {
  //     [Op.gte]: minLat
  //   }
  // }
  // if (maxLat) {
  //   upperLat = {
  //     [Op.lte]: maxLat
  //   }
  // }
  // if (minLng) {
  //   lowerLng = {
  //     [Op.gte]: minLng
  //   }
  // }
  // if (maxLng) {
  //   upperLng = {
  //     [Op.lte]: maxLng
  //   }
  // }
  // if (minPrice) {
  //   lowerPrice = {
  //     [Op.gte]: minPrice
  //   }
  // }
  // if (maxPrice) {
  //   upperPrice = {
  //     [Op.lte]: maxPrice
  //   }
  // }

  const where = {
    lat: {
      [Op.between]: [lowerLat, upperLat]
    },
    lng: {
      [Op.between]: [lowerLng, upperLng]
    },
    price: {
      [Op.between]: [lowerPrice, upperPrice]
    }
  }

  req.where = where;
  req.pag = pag
  next()
}

module.exports = paginationCheck
