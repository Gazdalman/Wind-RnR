const router = require('express').Router();
const usersRouter  = require('./users.js');
const sessionRouter  = require('./session.js');
const spotsRouter = require('./spots.js')
const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);

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
