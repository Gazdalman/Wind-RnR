const { ValidationError, Op } = require('sequelize');
const { handleValidationErrors } = require('./validation');
const moment = require('moment');
const { check } = require('express-validator');
const { Spot, Booking } = require('../db/models');



const validators = {
  validateSpot: [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage("Street address is required"),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage("City is required"),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage("State is required"),
    check("country")
      .exists({ checkFalsy: true })
      .withMessage("Country is required"),
    // check("lat")
    //   .exists({ checkFalsy: true })
    //   .withMessage("Latitude is not valid")
    //   .isFloat({ min: -90, max: 90 })
    //   .withMessage("Latitude must be between -90 and 90"),
    // check("lng")
    //   .exists({ checkFalsy: true })
    //   .withMessage("Longitude is not valid")
    //   .isFloat({ min: -180, max: 180 })
    //   .withMessage("Longitude must be a valid number between -180 and 180"),
    check("name")
      .exists({ checkFalsy: true })
      .isLength({ min: 5, max: 50 })
      .withMessage("Name must be 5 to 50 characters"),
    check("description")
      .exists({ checkFalsy: true })
      .withMessage("Description is required"),
    check("price")
      .exists({ checkFalsy: true })
      .withMessage("Price per day is required")
      .isFloat({ min: 0 })
      .withMessage("Price must be $0 or more"),
    handleValidationErrors
  ],
  validateSpotImage: [
    check('url')
      .exists({ checkFalsy: true })
      .withMessage("URL is invalid"),
    check('preview')
      .exists({ checkNull: true })
      .withMessage("preview cannot be blank"),
    handleValidationErrors
  ],
  validateReview: [
    check('review')
      .exists({ checkFalsy: true })
      .withMessage("Review must have a comment"),
    check('stars')
      .exists({ checkFalsy: true })
      .withMessage('Please enter a star amount')
      .isInt({ min: 1, max: 5 })
      .withMessage('Stars must be between 1 and 5'),
    handleValidationErrors
  ],
  validateReviewImage: [
    check('url')
      .exists({ checkFalsy: true })
      .withMessage("Url is invalid"),
    handleValidationErrors
  ],
  validateBooking: [
    check('startDate')
      .exists({ checkFalsy: true })
      .withMessage("A valid start date is required"),
    check('endDate')
      .exists({ checkFalsy: true })
      .withMessage('A valid end date is required'),
    handleValidationErrors
  ],

  checkDates: async (req, res, next) => {
    const { startDate, endDate } = req.body;
    const { spotId, bookingId } = req.params;

    let spot;
    let booking;
    let currBookings;

    if (spotId) {
      spot = await Spot.findByPk(spotId);
      currBookings = await spot.getBookings()
    } else if (bookingId) {
      booking = await Booking.findByPk(bookingId)
      spot = await Spot.findByPk(booking.spotId)
      currBookings = await spot.getBookings({
        where: {
          id: {
            [Op.not]: booking.id
          }
        }
      })
    }

    const err = new Error("Sorry, this spot is already booked for the specified dates");
    err.status = 403
    err.errors = {}
    let errorHit = false;

    for (const booking of currBookings) {
      const date1 = moment(booking.startDate, "YYYY/MM/DD")
      const date2 = moment(booking.endDate, "YYYY/MM/DD")
      const start = moment(new Date(startDate), "YYYY/MM/DD")
      const end = moment(new Date(endDate), "YYYY/MM/DD/")

      // if (start.isSameOrBefore(date1) && end.isSameOrAfter(date2)) {
      //   errorHit = true
      //   err.errors.matchingDates = "One or more of your dates conflict with an existing booking"
      // };
      if (start.isBefore(date1) && end.isAfter(date2)) {
        errorHit = true
        err.errors.dates = "Both dates surround an existing booking"
      }
      if (start.isSameOrAfter(date1) && start.isBefore(date2)) {
        errorHit = true
        err.errors.startDate = "Start date conflicts with an existing booking"
      };
      if (end.isSameOrAfter(date1) && end.isSameOrBefore(date2)) {
        errorHit = true
        err.errors.endDate = "End date conflicts with an existing booking"
      };
      if (new Date(start).toISOString().slice(0, 10) == new Date(booking.endDate).toISOString().slice(0, 10)) {
        errorHit = true
        err.errors.startDate = "Start date conflicts with an existing booking"
      }
      if (new Date(end).toISOString().slice(0, 10) == new Date(booking.startDate).toISOString().slice(0, 10)) {
        errorHit = true
        err.errors.endDate = "End date conflicts with an existing booking"
      }
      // Check if the new booking partially overlaps with an existing booking
      if (start.isBetween(date1, date2)) {
        errorHit = true;
        err.errors.startDate = "Start date conflicts with an existing booking"
      }
      if (end.isBetween(date1, date2)) {
        errorHit = true;
        err.errors.endDate = "End date conflicts with an existing booking"
      }
    }
    if (errorHit) {
      return next(err)
    }
    next()
  }
}

module.exports = validators
