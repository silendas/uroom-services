'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const BaseModel = require('../utils/baseModel');
const User = require('./userModel');
const Reply = require('./replyModel');

class ReplyLike extends BaseModel {
  static init(attributes, options) {
    return super.init({
      replyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'reply_id',
        references: {
          model: Reply,
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
          model: User,
          key: 'id',
        },
      },
      likeType: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'like_type',
        validate: {
          isIn: [['like', 'dislike']]
        }
      },
    }, {
      sequelize,
      modelName: 'ReplyLike',
      tableName: 'reply_likes',
      underscored: true,
    });
  }
}

const ReplyLikeModel = ReplyLike.init({}, { sequelize, modelName: 'ReplyLike' });

module.exports = ReplyLikeModel; 