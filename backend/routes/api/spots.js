const router = require('express').Router();
const { Spot, SpotImage, Review } = require('../../db/models');
const sequelize = require('sequelize')

router.get('/', async (req, res, next) => {
  const spots = await Spot.findAll();

  const spotsJSON = spots.map(spot => spot.toJSON());

  for (let i = 0; i < spotsJSON.length; i++) {
    const spot = spotsJSON[i];

    const { id } = spot

    const total = await Review.sum('stars', {
      where: {
        spotId: id
      }
    });

    const ratings = await Review.count({
      where: {
        spotId: id
      }
    });


    spot.avgRating = total / ratings
    const preview = await SpotImage.findAll({
      where: {
        spotId: id,
        preview: true
      },
      attributes: ['url']
    });

    spot.previewImage = preview[0].url
  }

  res.json({
    Spots: spotsJSON
  });
})

module.exports = router
