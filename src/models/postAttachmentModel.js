"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const BaseModel = require("../utils/baseModel");

class PostAttachment extends BaseModel {
  static init(attributes, options) {
    return super.init({
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "post_id"
      },
      attachmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "attachment_id"
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_deleted",
      },
    }, {
      sequelize,
      modelName: "PostAttachment",
      tableName: "Post_Attachments",
      underscored: true,
    });
  }
}

const PostAttachmentModel = PostAttachment.init({}, {
  sequelize,
  modelName: "PostAttachment",
  tableName: "Post_Attachments",
  underscored: true,
});

module.exports = PostAttachmentModel;