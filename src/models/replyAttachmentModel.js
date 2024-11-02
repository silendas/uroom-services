'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const BaseModel = require('../utils/baseModel');
const Reply = require('./replyModel');
const Attachment = require('./attachmentModel');

class ReplyAttachment extends BaseModel {
  static init(attributes, options) {
    return super.init({
      replyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'reply_id',
        references: {
          model: Reply,
          key: 'id',
        }
      },
      attachmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'attachment_id',
        references: {
          model: Attachment,
          key: 'id',
        }
      }
    }, {
      sequelize,
      modelName: 'ReplyAttachment',
      tableName: 'Reply_Attachments',
      underscored: true,
    });
  }
}

const ReplyAttachmentModel = ReplyAttachment.init({}, {
  sequelize,
  modelName: 'ReplyAttachment',
  tableName: 'Reply_Attachments',
  underscored: true,
});

module.exports = ReplyAttachmentModel; 