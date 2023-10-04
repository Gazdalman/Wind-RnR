const { Spot, Review, Booking } = require('../db/models')

const spotExists = async (req, res, next) => {
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

const reviewExists = async (req, res, next) => {
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

const bookingExists = async (req, res, next) => {
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
const userOwns = async (req, res, next) => {
  const { id } = req.user;
  const { review, spot, booking } = req;

  if (spot) {
    if (id != spot.ownerId) {
      const err = new Error("You are not authorized my friend.");
      err.status = 403;
      return next(err)
    }
    delete req.spot
    return next()

  } else if (review) {
    if (id != review.userId) {
      const err = new Error("You are not authorized my friend.");
      err.status = 403;
      return next(err)
    }
    delete req.review
    return next()

  }
  if (id != booking.userId) {
    const err = new Error("You are not authorized my friend.");
    err.status = 403;
    return next(err)
  }
  delete req.booking
  return next()


}



module.exports = {
  userOwns,
  spotExists,
  reviewExists,
  bookingExists
}
