'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const BaseModel = require('../utils/baseModel');

class Role extends BaseModel {
  static init(attributes, options) {
    return super.init({
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    }, {
      sequelize,
      modelName: 'Role',
      tableName: 'Roles',
      underscored: true,
    });
  }
}

// Inisialisasi model
const RoleModel = Role.init({}, { sequelize, modelName: 'Role' });


module.exports = RoleModel;
