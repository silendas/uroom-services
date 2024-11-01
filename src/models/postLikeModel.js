'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const BaseModel = require('../utils/baseModel');
const User = require('./userModel');
const Post = require('./postModel');

class PostLike extends BaseModel {
  static init(attributes, options) {
    return super.init({
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'post_id',
        references: {
          model: Post,
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
      modelName: 'PostLike',
      tableName: 'post_likes',
      underscored: true,
    });
  }
}

const PostLikeModel = PostLike.init({}, { sequelize, modelName: 'PostLike' });

module.exports = PostLikeModel; 