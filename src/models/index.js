"use strict";

const User = require("./userModel");
const Role = require("./roleModel");
const Post = require("./postModel");
const PostLike = require("./postLikeModel");
const PostAttachment = require("./postAttachmentModel");
const Attachment = require("./attachmentModel");
const Reply = require("./replyModel");
const ReplyAttachment = require("./replyAttachmentModel");
const ReplyLike = require("./replyLikeModel");

// Relation Definitions
const defineAssociations = () => {
  // User & Role Relations
  User.belongsTo(Role, {
    foreignKey: "role_id",
    as: "role",
    targetKey: "id",
  });
  Role.hasMany(User, {
    foreignKey: "role_id",
    as: "users",
    sourceKey: "id",
  });

  // Post & User Relations
  Post.belongsTo(User, { foreignKey: "user_id", as: "user" });
  User.hasMany(Post, { foreignKey: "user_id", as: "posts" });

  // Post & PostAttachment & Attachment Relations
  Post.hasMany(PostAttachment, {
    foreignKey: "post_id",
    as: "PostAttachments",
  });
  PostAttachment.belongsTo(Post, { foreignKey: "post_id", as: "post" });
  PostAttachment.belongsTo(Attachment, {
    foreignKey: "attachment_id",
    as: "attachment",
  });
  Attachment.hasMany(PostAttachment, {
    foreignKey: "attachment_id",
    as: "postAttachments",
  });

  // Post & PostLike Relations
  Post.hasMany(PostLike, { foreignKey: "post_id", as: "likes" });
  PostLike.belongsTo(Post, { foreignKey: "post_id", as: "post" });
  PostLike.belongsTo(User, { foreignKey: "user_id", as: "user" });
  User.hasMany(PostLike, { foreignKey: "user_id", as: "postLikes" });

  // Reply Relations
  Reply.belongsTo(User, { foreignKey: "user_id", as: "user" });
  Reply.belongsTo(Post, { foreignKey: "post_id", as: "post" });
  Reply.belongsTo(Reply, { foreignKey: "parent_reply_id", as: "parentReply" });
  Reply.hasMany(Reply, { foreignKey: "parent_reply_id", as: "childReplies" });

  Post.hasMany(Reply, { foreignKey: "post_id", as: "replies" });
  User.hasMany(Reply, { foreignKey: "user_id", as: "replies" });

  // Reply & ReplyAttachment Relations
  Reply.hasMany(ReplyAttachment, { foreignKey: "reply_id", as: "attachments" });
  ReplyAttachment.belongsTo(Reply, { foreignKey: "reply_id", as: "reply" });
  ReplyAttachment.belongsTo(Attachment, {
    foreignKey: "attachment_id",
    as: "attachment",
  });
  Attachment.hasMany(ReplyAttachment, {
    foreignKey: "attachment_id",
    as: "replyAttachments",
  });

  // Reply & ReplyLike Relations
  Reply.hasMany(ReplyLike, { foreignKey: "reply_id", as: "likes" });
  ReplyLike.belongsTo(Reply, { foreignKey: "reply_id" });
  ReplyLike.belongsTo(User, { foreignKey: "user_id" });
};

// Run Definitions
defineAssociations();

// Export all models
module.exports = {
  User,
  Role,
  Post,
  PostLike,
  PostAttachment,
  Attachment,
  Reply,
  ReplyAttachment,
  ReplyLike,
};
