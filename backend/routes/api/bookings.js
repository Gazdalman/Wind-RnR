const router = require('express').Router();
const { Booking, User, Spot, SpotImage, Review, ReviewImage } = require('../../db/models');
const sequelize = require('sequelize');
const { userOwns, bookingExists } = require('../../utils/errors')
const validators = require('../../utils/instances');
const { requireAuth } = require('../../utils/auth');

const commonErrs = [
  requireAuth,
  bookingExists,
  userOwns
]

// Get all bookings for Current User
router.get('/current', requireAuth, async (req, res) => {
  const { user } = req;
  const userId = user.id

  const userBookings = await Booking.findAll({
    where: {
      userId
    },
    include: [
      {
        model: Spot,
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      }
    ]
  });

  const bookings = [];

  for (const booking of userBookings) {
    const bookingObj = booking.toJSON();
    const spotImage = await SpotImage.findOne({
      where: {
        spotId: bookingObj.Spot.id,
        preview: true
      }
    });

    if (spotImage) bookingObj.Spot.previewImage = spotImage.url;

    bookings.push(bookingObj);
  }
  res.json({
    Bookings: bookings
  })
});

// Edit a booking
router.put('/:bookingId', commonErrs, validators.checkDates, async (req, res) => {
  const {bookingId} = req.params;
  let { startDate, endDate } = req.body;

  const booking = await Booking.findByPk(bookingId);

  startDate = new Date(startDate).toISOString().slice(0, 10);
  endDate = new Date(endDate).toISOString().slice(0, 10);

  booking.startDate = startDate;
  booking.endDate = endDate;
  booking.updatedAt = new Date();

  await booking.save();

  res.json(booking)
})

module.exports = router
