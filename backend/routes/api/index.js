const router = require('express').Router();

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
