'use strict';
const {
  Model, ValidationError
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(
        models.User, {
          foreignKey: 'userId'
        }
      );

      Review.belongsTo(
        models.Spot, {
          foreignKey: 'spotId'
        }
      );

      Review.hasMany(
        models.ReviewImage, {
          foreignKey: 'reviewId'
        }
      );
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNotFalsy(value) {
          if (value == "") {
            throw new ValidationError("Review must have a comment")
          }
        }
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1,
          msg: "Must give 1 to 5 star rating."
        },
        max: {
          args: 5,
          msg: "Must give 1 to 5 star rating."
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
