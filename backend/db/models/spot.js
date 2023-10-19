'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(
        models.User, {
        foreignKey: 'ownerId',
        as: 'owner'
      }
      );

      Spot.hasMany(
        models.SpotImage, {
        foreignKey: 'spotId'
      }
      );

      Spot.hasMany(
        models.Review, {
        foreignKey: 'spotId'
      }
      );

      Spot.hasMany(
        models.Booking, {
        foreignKey: 'spotId'
      }
      )
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.DECIMAL(9, 7),
      allowNull: false,
      validate: {
        isDecimal: {
          args: true,
          msg: "Latitude must be a number"
        },
        min: {
          args: -90,
          msg: "Minimum latitude exceeded"
        },
        max: {
          args: 90,
          msg: "Maximum latitude exceeded"
        }
      }
    },
    lng: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "Latitude must be a number"
        },
        min: {
          args: -180,
          msg: "Minimum longitude exceeded"
        },
        max: {
          args: 180,
          msg: "Maximum longitude exceeded"
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // len: [5, 50]
        is50OrLess(value) {
          if (value.length >= 50 || value.length < 5) {
            throw new ValidationError("Name must be between 5 or 50 characters")
          }
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
        isDecimal: {
          msg: "Latitude must be a number"
        },
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
    defaultScope: {
      order: [['id']]
    }
  });
  return Spot;
};
