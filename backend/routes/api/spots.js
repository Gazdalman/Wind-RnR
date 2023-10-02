const router = require('express').Router();
const { User, Spot, SpotImage, Review } = require('../../db/models');
const sequelize = require('sequelize');
const {requireAuth} = require('../../utils/auth')

router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll({
        include: [
            {
                model: SpotImage,
                attributes: ['url']
            }
        ]
    });


    const spotsJSON = spots.map(spot => spot.toJSON());

    for (let i = 0; i < spotsJSON.length; i++) {
        const spot = spotsJSON[i];

        const reviews = await Review.findAll({
            where: {
                spotId: spot.id
            }
        })

        const avg = await Review.sum('stars', {
            where: {
                spotId: spot.id
            }
        })

        spot.avgRating = avg / reviews.length;
        spot.previewImage = spot.SpotImages[0]
        delete spot.SpotImages
    }

    res.json({
        Spots: spotsJSON
    });
})
// Get all spots owned by the Current
router.get('/current', requireAuth, async (req, res) => {

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

// Get a spot based on spotId
router.get('/:spotId', async (req, res) => {
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
   res.status(404);
   res.json({
    message: "Spot not found."
   })
  }

  const spotObj = spot.toJSON()

  const total = await Review.sum('stars', {
    where: {
      spotId
    }
  });

  const ratings = await Review.count({
    where: {
      spotId
    }
  });

  spotObj.avgRating = total / ratings

  spotObj.SpotImages = await spot.getSpotImages();

  spotObj.Owner = await spot.getOwner({
    attributes: {
      exclude: ['username']
    }
  })

  res.json(
    spotObj
  );
})

router.post('/', requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const { user } = req;

  const owner = await User.findByPk(user.id);

  const newSpot = await owner.createSpot({
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  });

  res.json(newSpot)
})
module.exports = router
