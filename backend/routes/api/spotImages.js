const router = require('express').Router();
const { SpotImage, ReviewImage } = require('../../db/models');
const sequelize = require('sequelize');
const { userImage, imageExists } = require('../../utils/errors')
const validators = require('../../utils/instances');
const { requireAuth } = require('../../utils/auth');

router.delete('/:imageId', requireAuth, imageExists, userImage, async(req,res) => {
  const {imageId} = req.params;

  const image = await SpotImage.findByPk(imageId);

  // await image.destroy();

  res.json("Success");
})

module.exports = router
