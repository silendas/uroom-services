'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const BaseModel = require('../utils/baseModel');

const Attachment = BaseModel.init({
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'file_name'
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'file_path'
  },
}, {
  sequelize,
  modelName: 'Attachment',
  tableName: 'Attachments', 
  underscored: true,
});

module.exports = Attachment;