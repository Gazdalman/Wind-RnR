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

router.get('/current', async (req, res) => {
  // const { user } = req;

  // const userSpots = await user.getSpots({
  //   include: [
  //     {
  //       model: Review,
  //       attributes: []
  //     },
  //   ],
  //   attributes: {
  //     include: [
  //       [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating']
  //     ]
  //   },
  //   group: ['Spot.id']
  // });



  // res.json(userSpots);

  const { user } = req;
  const { id } = user

  const spots = await Spot.findAll({
    where: {
      ownerId: id
    }
  })

  const spotsJSON = spots.map(spot => spot.toJSON());

  for (let i = 0; i < spotsJSON.length; i++) {
    const spot = spotsJSON[i];
    const spotId = spot.id


    const total = await Review.sum('stars', {
      where: {
        spotId: spotId
      }
    });

    const ratings = await Review.count({
      where: {
        spotId: spotId
      }
    });


    spot.avgRating = total / ratings
    spot.SpotImages = await SpotImage.findAll({
      where: {
        spotId: spotId,
      },
    });
  }

  res.json(
    spotsJSON
  );
})


// router.post('/', async(req,res) => {

// })

module.exports = router
