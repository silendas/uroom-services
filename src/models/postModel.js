"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const BaseModel = require("../utils/baseModel");

class Post extends BaseModel {
  static init(attributes, options) {
    return super.init({
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id"
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'Post',
      tableName: 'Posts',
      underscored: true,
    });
  }
}

const PostModel = Post.init({}, {
  sequelize,
  modelName: 'Post',
  tableName: 'Posts',
  underscored: true,
});

module.exports = PostModel;