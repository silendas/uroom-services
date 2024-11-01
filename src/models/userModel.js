'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const BaseModel = require('../utils/baseModel');
const Role = require('./roleModel');

class User extends BaseModel {
  static init(attributes, options) {
    return super.init({
      npm: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      actived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "role_id",
        defaultValue: 2,
        references: {
          model: Role,
          key: 'id',
        },
      },
    }, {
      sequelize,
      modelName: 'User',
    });
  }
}

const UserModel = User.init({}, { sequelize, modelName: 'User' });

module.exports = UserModel;
