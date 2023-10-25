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
  console.log(id);
  const { review, spot, booking, method } = req;

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
  const bkSpot = await booking.getSpot()

  if (id != booking.userId && id != bkSpot.ownerId) {
    const err = new Error(`Forbidden`);
    err.status = 403;
    return next(err)
  }

  if (id == bkSpot.ownerId && method == "PUT") {
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
const userImage = async (req, _res, next) => {
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

const pgMsg = "Page must be greater than or equal to 1"
const szMsg = "Size must be greater than or equal to 1"
const mnLtMsg = "Maximum latitude is invalid"
const mxLtMsg = "Minimum latitude is invalid"
const mnLngMsg = "Minimum longitude is invalid"
const mxLngMsg = "Maximum longitude is invalid"
const minPriceMsg = "Minimum price must be greater than or equal to 0"
const maxPriceMsg = "Maximum price must be greater than or equal to 0"

// Checking if query params are named and defined
const queryCheck = (req,_res,next) => {
  const err = new Error("Bad request");
  err.status = 400;
  err.errors = {};
  let errorHit;
  const queryKeys = Object.keys(req.query);

 if (req.query.page < 1) {
    errorHit = true;
    err.errors.page = pgMsg;
  };

  if (req.query.size < 1) {
    errorHit = true;
    err.errors.size = szMsg;
  };

  if (req.query.maxLat > 90) {
    errorHit = true;
    err.errors.maxLat = mxLtMsg;
  };

  if (req.query.minLat < -90) {
    errorHit = true;
    err.errors.minLat = mnLtMsg;
  };

  if (req.query.minLng < -180) {
    errorHit = true;
    err.errors.minLng = mnLngMsg;
  };

  if (req.query.maxLng > 180) {
    errorHit = true;
    err.errors.maxLng = mxLngMsg;
  };

  if (req.query.minPrice < 0) {
    errorHit = true;
    err.errors.minPrice = minPriceMsg;
  };

  if (req.query.maxPrice < 0) {
    errorHit = true;
    err.errors.maxPrice = maxPriceMsg;
  };

  for (let key of queryKeys) {
    if (!req.query[key]) {
      errorHit = true;
      if (key == "page") err.errors[key] = pgMsg;
      if (key == "size") err.errors[key] = szMsg;
      if (key == "maxLat") err.errors[key] = mxLtMsg;
      if (key == "minLat") err.errors[key] = mnLtMsg;
      if (key == "minLng") err.errors[key] = mnLngMsg;
      if (key == "maxLng") err.errors[key] = mxLngMsg;
      if (key == "minPrice") err.errors[key] = minPriceMsg;
      if (key == "maxPrice") err.errors[key] = maxPriceMsg;
    };
  };

  if (errorHit) {
    return next(err)
  }

  next()
}

const doesNotOwn = async(req,_res,next) => {
  const {spot, user} = req;

  if (user.id == spot.ownerId) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err)
  }

  next()
}

const alreadyReviewed = async(req,res,next) => {
  const { user } = req;
  const {spotId} = req.params

  const review = await Review.findOne({
    where: {
      userId: user.id,
      spotId
    }
  });

  if (review) {
    const err = new Error("User already has a review for this spot");
    err.status = 500;
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
  imageExists,
  queryCheck,
  doesNotOwn,
  alreadyReviewed
}
