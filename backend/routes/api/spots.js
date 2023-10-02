const router = require('express').Router();
const { Spot, SpotImage, Review } = require('../../db/models');
const sequelize = require('sequelize')


router.get('/', async (req, res, next) => {
  const spots = await Spot.findAll({
    include: [
      {
        model: SpotImage,
        attributes: ['url']
      },
      {
        model: Review,
        attributes: []
      }
    ],
    attributes: {
      include: [
        [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating']
      ]
    },
    group: ['Spot.id'] // Group by Spot.id to get the average rating for each spot
  });

  const spotsJSON = spots.map(spot => spot.toJSON());

  for (let i = 0; i < spotsJSON.length; i++) {
    const spot = spotsJSON[i];

    spot.previewImage = spot.SpotImages[0].url
    delete spot.SpotImages
  }

  res.json({
    Spots: spotsJSON
  });
})

router.get('/current', async (req, res) => {
  const { user } = req;

  const userSpots = await user.getSpots({
    include: [
      {
        model: Review,
        attributes: []
      },
    ],
    attributes: {
      include: [
        [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating']
      ]
    }
  });
  const images = await SpotImage.findAll({
    where: {
      spotId: 1
    }
  });

  
  res.json({});
});

// router.post('/', async(req,res) => {

// })

module.exports = router
