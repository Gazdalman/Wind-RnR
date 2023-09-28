const router = require('express').Router();
const { User } = require('../../db/models')

const { setTokenCookie, restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);

router.get('/csrf/restore', (req,res) => {
  const token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token);
  res.status(200).json({
    'XSRF-Token': token
  });
});

module.exports = router;
