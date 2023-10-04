const { Spot, Review, Booking } = require('../db/models')

const spotExists = async (req, res, next) => {
  const {spotId} = req.params;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    const err = new Error("Spot not found.");
    err.status = 404;
    next(err)
  }
  req.Spot = spot
  next()
}

const userOwns = async(req,res,next) => {
  const { id } = req.user;
  const spot = req.Spot;

  if (id != spot.id) {
    const err = new Error("You are not authorized my friend.");
    err.status = 403;
    next(err)
  }
  delete req.Spot
  next()
}

module.exports = {
  userOwns,
  spotExists
}
