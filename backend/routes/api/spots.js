const router = require('express').Router();
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');
const { userOwns, spotExists, queryCheck, doesNotOwn, alreadyReviewed } = require('../../utils/errors')
const validators = require('../../utils/instances');
const paginationCheck = require('../../utils/pagination');
const { requireAuth } = require('../../utils/auth');

const commonErrs = [
  requireAuth,
  spotExists
]

// Get all spots from the Server
router.get('/', queryCheck, paginationCheck, async (req, res) => {
  const { where, pag } = req;
  const { page, size } = req;
  const spots = await Spot.findAll({
    where,
    order: [['id']],
    ...pag
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
    Spots: spotsJSON,
    page: parseInt(page),
    size: parseInt(size)
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
router.get('/:spotId/reviews', spotExists, async (req, res) => {
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

  res.json({
    Reviews: allReviews})
});

// Get all bookings for a spot
router.get('/:spotId/bookings', commonErrs, async(req,res) => {
  const { user } = req;
  const {spotId} = req.params;

  const spot = await Spot.findByPk(spotId);
  let bookings;

  if (user.id == spot.ownerId) {
    bookings = await spot.getBookings({
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      }]
    })
  } else {
    bookings = await spot.getBookings({
      attributes: ['spotId', 'startDate', 'endDate']
    })
  }

  res.json({
    Bookings: bookings
  })
})

// Get a spot based on spotId
router.get('/:spotId', spotExists, async (req, res) => {
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);

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

// Create a booking for a spot
router.post('/:spotId/bookings', commonErrs, doesNotOwn, validators.checkDates, async (req, res) => {
  const { spotId } = req.params;
  const { id } = req.user;
  let { startDate, endDate } = req.body;

  const spot = await Spot.findByPk(spotId);

  startDate = new Date(startDate).toISOString().slice(0, 10)
  endDate = new Date(endDate).toISOString().slice(0, 10)

  const booking = await spot.createBooking({
    userId: id,
    startDate,
    endDate,
  });

  res.json(booking)
})

// Create a review for a spot
router.post('/:spotId/reviews', commonErrs, doesNotOwn, alreadyReviewed, async (req, res) => {
  const { user } = req;
  const { spotId } = req.params;
  const { review, stars } = req.body;

  const spot = await Spot.findByPk(spotId);

  const newReview = await spot.createReview({
    review,
    stars,
    userId: user.id
  });

  res.json(newReview)
});

// Add an image to an owned spot based on id
router.post('/:spotId/images', commonErrs, userOwns, validators.validateSpotImage, async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body

  const spot = await Spot.findByPk(spotId);

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
router.put('/:spotId', commonErrs, userOwns, validators.validateSpot, async (req, res) => {
  const { user } = req;
  const { spotId } = req.params;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const updatedAt = Date.now()
  const spot = await Spot.findByPk(spotId);

  const attributes = { address, city, state, country, lat, lng, name, description, price, updatedAt };

  for (const attr in attributes) {
    spot[attr] = attributes[attr]
  };

  await spot.save();

  res.json(spot);
});

// Delete a Spot
router.delete('/:spotId', commonErrs, userOwns, async (req, res) => {
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);

  await spot.destroy();

  res.json({
    message: "Spot successfully deleted"
  })
});



module.exports = router
