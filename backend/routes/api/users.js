const express = require('express')
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Review, Spot, SpotImage, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage("Fist name is required"),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last name is required'),
  handleValidationErrors
];

router.get('/this-is-bananable', async (_req,res) => {
  const users = await User.findAll()
  const reviews = await Review.findAll({
    include: {
      model: ReviewImage
    }
  });
  const spots = await Spot.findAll({
    include: [{
      model: SpotImage
    },
    {
      model: Booking
    }]
  });

  res.json({users, spots, reviews})
})

router.get('/this-is-not', async(req,res) => {
  const users = await User.count();
  const reviews = await Review.count();
  const spots = await Spot.count();
  const spotImages = await SpotImage.count();
  const reviewImages = await ReviewImage.count();
  const bookings = await Booking.count();

  res.json({
    users,
    reviews,
    spots,
    spotImages,
    reviewImages,
    bookings
  })
});

// Sign-up Route Handler
router.post('/', validateSignup, async (req, res) => {
  const { email, password, username, firstName, lastName, addDates } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  let newLN;

  if (lastName) {
    newLN = lastName
  } else newLN = null

  const user = await User.create({ email, username, firstName, hashedPassword, lastName: newLN });

  const safeUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
  };

  if (addDates) {
    const {createdAt, updatedAt} = await User.unscoped().findByPk(user.id);
    safeUser.createdAt = createdAt;
    safeUser.updatedAt = updatedAt;
  }

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser
  });
})

router.get('/test', async (req, res) => {
  const user = await User.findByPk(1, {
    include: [Review, Spot]
  });

  res.json(user)
});

router.delete('/', async (req, res) => {
  const { user } = req;
  const { id } = user;

  const formerUser = await User.findByPk(id);

  await formerUser.destroy();

  res.json({
    message: "Account successfully deleted. You will be missed!"
  })
})
module.exports = router;
