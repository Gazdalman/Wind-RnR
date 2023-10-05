'use strict';
const {
  Model, ValidationError, Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(
        models.User, {
          foreignKey: 'userId'
        }
      );

      Booking.belongsTo(
        models.Spot, {
          foreignKey: 'spotId'
        }
      )
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        checkStart(value) {
          // if (new Date(value).getTime() < new Date().getTime()) {
            if(new Date(value).toISOString().slice(0, 10) < new Date().toISOString().slice(0, 10)) {
            throw new Error(`Start dat should be on or after ${new Date().toLocaleDateString()}`)
          }
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        checkEnd(value) {
          if (value <= this.startDate) {
            throw new Error('Stay must be at least one day')
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
