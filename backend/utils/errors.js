const { Spot, Review, Booking, SpotImage, ReviewImage } = require('../db/models')

// Check to make sure that a requested spot is in the database
const spotExists = async (req, _res, next) => {
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    const err = new Error("Spot not found.");
    err.status = 404;
    return next(err)
  }
  req.spot = spot
  next()
}

// Check to make sure that a requested review is in the database
const reviewExists = async (req, _res, next) => {
  const { reviewId } = req.params;

  const review = await Review.findByPk(reviewId);

  if (!review) {
    const err = new Error("Review not found.");
    err.status = 404;
    return next(err)
  }
  req.review = review
  next()
}

// Check to make sure that a requested image is in the database
const imageExists = async (req, _res, next) => {
  const { imageId } = req.params;

  let spotImage;
  let reviewImage;

  if (req.originalUrl.includes("spot")) spotImage = await SpotImage.unscoped().findByPk(imageId);
  if (req.originalUrl.includes("review")) reviewImage = await ReviewImage.unscoped().findByPk(imageId);

  if (!(spotImage || reviewImage)) {
    const err = new Error("Image not found.");
    err.status = 404;
    return next(err)
  }
  req.image = spotImage ? spotImage : reviewImage
  next()
}

// Check to make sure that a booking is in the database
const bookingExists = async (req, _res, next) => {
  const { bookingId } = req.params;

  const booking = await Booking.findByPk(bookingId);

  if (!booking) {
    const err = new Error("Booking not found.");
    err.status = 404;
    return next(err)
  }
  req.booking = booking
  next()
}

// Check if a user owns a specific resource
const userOwns = async (req, _res, next) => {
  const { id } = req.user;
  const { review, spot, booking } = req;

  if (spot) {
    if (id != spot.ownerId) {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err)
    }
    delete req.spot
    return next()

  } else if (review) {
    if (id != review.userId) {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err)
    }
    delete req.review
    return next()

  }
  if (id != booking.userId) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err)
  }
  delete req.booking
  return next()

}

// Check to make sure the end date of a booking hasn't passed
const bookingNotPast = async (req, _res, next) => {
  const { bookingId } = req.params;

  const booking = await Booking.findByPk(bookingId);
  const today = new Date().getTime();
  const bookingEnd = new Date(booking.endDate).getTime();

  if (today > bookingEnd) {
    const err = new Error("Cannot make changes to past bookings");
    err.status = 403;
    return next(err);
  }
  next()
}

// Check if the current user owns the resource the image is attached to
const userImage = async (req, res, next) => {
  const { image, user } = req;

  if (image.reviewId) {
    const review = await Review.findByPk(image.reviewId);

    if (user.id != review.userId) {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err)
    }
    return next()
  }

  const spot = await Spot.findByPk(image.spotId);

  if (user.id != spot.ownerId) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err)
  }

  next()
}


module.exports = {
  userOwns,
  spotExists,
  reviewExists,
  bookingExists,
  bookingNotPast,
  userImage,
  imageExists
}
