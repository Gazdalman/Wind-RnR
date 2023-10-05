const router = require('express').Router();
const usersRouter  = require('./users.js');
const sessionRouter  = require('./session.js');
const spotsRouter = require('./spots.js');
const reviewRouter = require('./reviews.js');
const bookingRouter = require('./bookings.js');
const spImgRouter = require('./spotImages.js');
const rvImgRouter = require('./reviewImages.js')
const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);

router.use('/reviews', reviewRouter);

router.use('/bookings', bookingRouter);

router.use('/spot-images', spImgRouter);

router.use('/review-images', rvImgRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

router.get('/csrf/restore', (req,res) => {
  const token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token);
  res.status(200).json({
    'XSRF-Token': token
  });
});

module.exports = router;
