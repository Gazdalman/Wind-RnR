const router = require('express').Router();
const { User, Spot, SpotImage, Review, ReviewImage } = require('../../db/models');
const sequelize = require('sequelize');
const validators = require('../../utils/instances');
const { requireAuth } = require('../../utils/auth');
const user = require('../../db/models/user');


// Get all reviews from current user
router.get('/current', requireAuth,async (req, res) => {
  const { user } = req;
  const userId = user.id

  const userReviews = await Review.findAll({
    where: {
      userId
    },
    include: [{
      model: User,
      attributes: ['id', 'firstName', 'lastName']
    },
    {
      model: Spot,
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    },
    {
      model: ReviewImage,
      attributes: ['id','url']
    }]
  });

  const reviews = [];

  for (const review of userReviews) {
    const reviewObj = review.toJSON();
     const spotImage = await SpotImage.findOne({
      where: {
        spotId: reviewObj.Spot.id,
        preview: true
      }
    });

    if (spotImage) reviewObj.Spot.previewImage = spotImage.url;

    if (reviewObj.ReviewImages.length < 1) delete reviewObj.ReviewImages

    reviews.push(reviewObj);
  }
  res.json(reviews)
});

// Add an image to a review
router.post('/:reviewId/images', requireAuth, validators.validateReviewImage, async (req, res) => {
  const { reviewId } = req.params;
  const { url } = req.body;
  const { user } = req;

  const review = await Review.findByPk(reviewId);
  const imageCount = await ReviewImage.count({
    where: {
      reviewId
    }
  })

  if (!review) {
    res.status(404);
    return res.json({
      message: "Review not found"
    })
  }
  if (imageCount == 10) {
    res.status(403);
    return res.json({
      message: "Maximum number of images for this resource was reached"
    })
  }
  if (user.id != review.userId) {
    res.status(403);
    return res.json({
      message: "You are not authorized my friend."
    })
  }

  const image = await review.createReviewImage({
    url
  }, {
    attributes: ['id', 'url']
  })


  res.json({
    id: image.id,
    url: image.url
  });
});

// Edit a review
router.put('/:reviewId', requireAuth, validators.validateReview, async(req,res) => {
  const {reviewId} = req.params;
  const { user } = req;
  const { review, stars} = req.body;

  const rev = await Review.findByPk(reviewId);

  if (!rev) {
    res.status(404);
    return res.json({
      message: "Review not found"
    })
  };

  if (user.id != rev.userId) {
    res.status(403);
    return res.json({
      message: "You are not authorized my friend."
    });
  };

  rev.review = review;
  rev.stars = stars;

  await rev.save();

  res.json(rev)
});

router.delete('/:reviewId', requireAuth, async(req,res) => {
  const { user } = req;
  const {reviewId} = req.params;

  const rev = await Review.findByPk(reviewId);

  if (!rev) {
    res.status(404);
    return res.json({
      message: "Review not found"
    });
  };

  if (user.id != rev.userId) {
    res.status(403)
    return res.json({
      message: "You are not authorized my friend."
    })
  };

  await rev.destroy();

  res.json({
    message: "Review successfully deleted!"
  });
})

module.exports = router
