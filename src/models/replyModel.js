"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const BaseModel = require("../utils/baseModel");
const User = require('./userModel');
const Post = require('./postModel');

class Reply extends BaseModel {
  static init(attributes, options) {
    return super.init({
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "post_id",
        references: {
          model: Post,
          key: 'id',
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
        references: {
          model: User,
          key: 'id',
        }
      },
      parentReplyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "parent_reply_id",
        references: {
          model: Reply,
          key: 'id'
        }
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      }
    }, {
      sequelize,
      modelName: 'Reply',
      tableName: "Replies",
      underscored: true,
    });
  }
}

const ReplyModel = Reply.init({}, { 
  sequelize, 
  modelName: 'Reply',
  tableName: "Replies",
  underscored: true 
});

module.exports = ReplyModel;
