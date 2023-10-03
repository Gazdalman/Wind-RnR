const router = require('express').Router();
const { check } = require('express-validator');
const { User, Spot, SpotImage, Review, ReviewImage } = require('../../db/models');
const sequelize = require('sequelize');
const validators = require('../../utils/instances');
const { requireAuth } = require('../../utils/auth')

// Get all spots from the Server
router.get('/', async (req, res, next) => {
  const spots = await Spot.findAll({
    order: [['id']]
  });

  const spotsJSON = spots.map(spot => spot.toJSON());

  for (let spot of spotsJSON) {
    const total = await Review.count({
      where: {
        spotId: spot.id
      }
    })

    const sum = await Review.sum('stars', {
      where: {
        spotId: spot.id
      }
    })

    spot.avgRating = sum / total;

    const previewImg = await SpotImage.findOne({
      where: {
        spotId: spot.id,
        preview: true
      },
      attributes: ['url']
    });

    if (previewImg) {
      const imgObj = previewImg.toJSON()
      spot.previewImage = imgObj.url
    }
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
        spotId
      }
    });

    const ratings = await Review.count({
      where: {
        spotId
      }
    });

    spot.avgRating = total / ratings
    const images = await SpotImage.findAll({
      where: {
        spotId: spotId,
        preview: true
      },
    });

    if (images.length) spot.previewImage = images[0].url
  }

  res.json(
    spotsJSON
  );
});


// Get all reviews by spot id
router.get('/:spotId/reviews', async (req, res) => {
  const { spotId } = req.params;


  const reviews = await Review.findAll({
    where: {
      spotId
    },
    include: [{
      model: User,
      attributes: ['id', 'firstName', 'lastName']
    },
    {
      model: ReviewImage,
      attributes: ['id', 'url']
    }]
  });

  const allReviews = [];

  for (const review of reviews) {
    const reviewObj = review.toJSON();

    if (reviewObj.ReviewImages.length < 1) delete reviewObj.ReviewImages

    allReviews.push(reviewObj);

  }

  res.json(allReviews)
});

// Get a spot based on spotId
router.get('/:spotId', async (req, res) => {
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    res.status(404);
    return res.json({
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

  spotObj.numReviews = ratings

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

// Create a review for a spot
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
  const { user } = req;
  const { spotId } = req.params;
  const { review, stars } = req.body;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot cannot be found"
    });
  };

  const newReview = await spot.createReview({
    review,
    stars,
    userId: user.id
  });

  res.json(newReview)
});

// Add an image to an owned spot based on id
router.post('/:spotId/images', requireAuth, validators.validateSpotImage, async (req, res) => {
  const { user } = req;
  const { spotId } = req.params;
  const { url, preview } = req.body

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot could not be found."
    })
  }

  if (user.id !== spot.ownerId) {
    res.status(403);
    return res.json({
      message: "You are not authorized my friend!"
    })
  };

  if (preview == true) {
    await SpotImage.update({ preview: false }, {
      where: {
        spotId
      }
    });
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
router.post('/', requireAuth, validators.validateSpot, async (req, res) => {
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
router.put('/:spotId', requireAuth, validators.validateSpot, async (req, res) => {
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
router.delete('/:spotId', requireAuth, async (req, res) => {
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
    message: "Spot successfully deleted"
  })
});


module.exports = router
