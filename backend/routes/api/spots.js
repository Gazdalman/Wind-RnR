const router = require('express').Router();
const { User, Spot, SpotImage, Review } = require('../../db/models');
const sequelize = require('sequelize');
const { requireAuth } = require('../../utils/auth')

// Get all spots from the Server
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
    if (spot.SpotImages.length > 0) {
      spot.previewImage = spot.SpotImages[0].url
    }

    delete spot.SpotImages
  }

  res.json({
    Spots: spotsJSON
  });
});

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
});

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
});

// Add an image to an owned spot based on id
router.post('/:spotId/images', requireAuth, async (req, res) => {
  const { user } = req;
  const { spotId } = req.params;
  const { url, preview } = req.body

  const spot = await Spot.findByPk(spotId);

  if (!spot)

    if (user.id !== spot.ownerId) {
      res.status(403);
      return res.json({
        message: "You are not authorized my friend!"
      })
    };

  const image = await spot.createSpotImage({
    url,
    preview
  });

  const imgPreview = {
    id: image.id,
    url: image.url,
    preview: image.preview
  }
  res.json(imgPreview);
});

// Create a Spot
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
});

// Edit a spot
router.put('/:spotId', requireAuth, async (req, res) => {
  const { user } = req;
  const { spotId } = req.params;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot not found."
    })
  }

  if (user.id !== spot.ownerId) {
    res.status(403);
    return res.json({
      message: "You are not authorized to make changes to this spot"
    })
  };

  const attributes = { address, city, state, country, lat, lng, name, description, price };

  for (const attr in attributes) {
    spot[attr] = attributes[attr]
  };

  await spot.save();

  res.json(spot);
});

// Delete a Spot
router.delete('/:spotId', requireAuth, async(req,res) => {
  const { user } = req;
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot not found."
    })
  }

  if (user.id !== spot.ownerId) {
    res.status(403);
    return res.json({
      message: "You are not authorized to make changes to this spot"
    })
  };

  await spot.destroy();

  res.json({
    message: "Spot has successfully been deleted."
  })
});


module.exports = router
