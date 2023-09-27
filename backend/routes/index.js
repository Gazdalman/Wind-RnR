const express = require('express');
const router = express.Router();

router.get('/api/csrf/restore', (req,res) => {
  const token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token);
  res.status(200).json({
    'XSRF-Token': token
  });
});

module.exports = router;
