'use strict';

const { Model, DataTypes } = require('sequelize');

class BaseModel extends Model {
  static init(attributes, options) {
    const baseAttributes = {
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
        field: "updated_at",
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "created_by",
      },
      updatedBy: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "updated_by"
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      ...attributes,
    };

    options.hooks = {
      beforeCreate: (instance, options) => {
        instance.createdBy = options.user ? options.user.username : 'system';
        instance.updatedBy = options.user ? options.user.username : 'system';
      },
      beforeUpdate: (instance, options) => {
        instance.updatedBy = options.user ? options.user.username : 'system';
      },
    };

    return super.init(baseAttributes, options);
  }
}

module.exports = BaseModel;
