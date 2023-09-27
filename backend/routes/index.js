const express = require('express');
const router = express.Router();
const apiRouter = require('./api');


router.use('/api', apiRouter);

router.get('/api/csrf/restore', (req,res) => {
  const token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token);
  res.status(200).json({
    'XSRF-Token': token
  });
});


module.exports = router;
