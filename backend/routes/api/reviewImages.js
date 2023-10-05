const router = require('express').Router();
const { ReviewImage } = require('../../db/models');
const { imageExists, userImage } = require('../../utils/errors')
const { requireAuth } = require('../../utils/auth');

router.delete('/:imageId', requireAuth, imageExists, userImage, async(req,res) => {

  const {imageId} = req.params;

  const image = await ReviewImage.unscoped().findByPk(imageId);

  await image.destroy();

  res.json({
    "message": "Successfully deleted"
  });
})

module.exports = router
