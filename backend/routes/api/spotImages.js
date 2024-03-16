const router = require('express').Router();
const { SpotImage } = require('../../db/models');
const { imageExists, userImage } = require('../../utils/errors')
const { requireAuth } = require('../../utils/auth');

router.delete('/:imageId', requireAuth, imageExists, userImage, async(req,res) => {

  const {imageId} = req.params;

  const image = await SpotImage.findByPk(imageId);

  await image.destroy();

  res.json({
    "message": "Successfully deleted"
  });
})



module.exports = router
