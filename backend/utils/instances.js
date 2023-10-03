const { handleValidationErrors } = require('./validation')
const { check } = require('express-validator');

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
      .exists({ checkFalsy: true })
      .withMessage("Latitude is not valid"),
    check("lng")
      .exists({ checkFalsy: true })
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
      .exists({ checkFalsy: true })
      .withMessage("preview cannot be blank"),
    handleValidationErrors
  ],
  validateReview: [
    check('review')
      .exists()
      .withMessage("Review must have a comment"),
    check('stars')
      .exists()
      .withMessage('Please enter a star amount'),
    handleValidationErrors
  ],
  validateReviewImage: [
    check('url')
      .exists({ checkFalsy: true })
      .withMessage("Url is invalid"),
    handleValidationErrors
  ]
}
module.exports = validators
