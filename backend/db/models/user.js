'use strict';

const { Model, Validator, ValidationError } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const err =new Error();
  err.errors = {}
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(
        models.Spot, {
          foreignKey: 'ownerId'
        }
      );

      User.hasMany(
        models.Review, {
          foreignKey: 'userId'
        }
      );

      User.hasMany(
        models.Booking, {
          foreignKey: 'userId'
        }
      )
    }
  };

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Username must be unique"
        },
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              const err = new ValidationError("Username cannot be an email");
              throw err
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Email must be unique"
        },
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 20]
        }
      },
      lastName: {
        type: DataTypes.STRING,
        validate: {
          len: [1, 20]
        }
      },
    }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes:
       {exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']}
    }
  }
  );

  return User;
};
