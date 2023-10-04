const { ValidationError, Op } = require('sequelize');
const { handleValidationErrors } = require('./validation');
const moment = require('moment')
const { check } = require('express-validator');
const { Spot } = require('../db/models')


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
    check("lat")
      .exists({ checkNull: true })
      .withMessage("Latitude is not valid"),
    check("lng")
      .exists({ checkNull: true })
      .withMessage("Longitude is not valid"),
    check("name")
      .exists({ checkFalsy: true })
      .withMessage("Name must be less than 50 characters"),
    check("description")
      .exists({ checkFalsy: true })
      .withMessage("Description is required"),
    check("price")
      .exists({ checkFalsy: true })
      .withMessage("Price per day is required"),
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
      .exists()
      .withMessage("Review must have a comment"),
    check('stars')
      .exists({ checkFalsy: true })
      .withMessage('Please enter a star amount'),
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
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId);

    const currBookings = await spot.getBookings();

    for (const booking of currBookings) {
      const compareDates = (date, ...dates) => {
        for (let dt of dates) {
          if (dt == date) {
            return true
          }
        }
        return false
      }

      const date1 = moment(booking.startDate, "MM/DD/YYYY")
      const date2 = moment(booking.endDate, "MM/DD/YYYY")
      const start = moment(startDate, "MM/DD/YYYY")
      const end = moment(endDate, "MM/DD/YYYY")

      if (start.isSameOrBefore(date1) && end.isSameOrAfter(date2)) {
        const err = new ValidationError("There is a booking conflict");
        return next(err);
      }

      // Check if the new booking partially overlaps with an existing booking
      if (start.isBetween(date1, date2) || end.isBetween(date1, date2)) {
        const err = new ValidationError("There is a booking conflict");
        return next(err);
      }
    }

    next()
  }
}
module.exports = validators
