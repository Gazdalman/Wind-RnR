const router = require('express').Router();
const { Spot, SpotImage, Review } = require('../../db/models');
const sequelize = require('sequelize')

router.get('/', async (req, res, next) => {
  const spots = await Spot.findAll({
    include: [
      {
        model: Review,
        attributes: []
      }
    ],
    attributes: {
      include: [
      [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating']
    ]
  } // Group by Spot.id to get the average rating for each spot
  });

  const spotsJSON = spots.map(spot => spot.toJSON());

  for (let i = 0; i < spotsJSON.length; i++) {
    const spot = spotsJSON[i];

    const preview = await SpotImage.findAll({
      where: {
        spotId: spot.id,
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
