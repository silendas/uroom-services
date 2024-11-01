'use strict';

const {
  Reply,
  User,
  ReplyAttachment,
  Attachment,
  ReplyLike
} = require("../models");
const { uploadFile, deleteFile } = require("../utils/fileHandler");

// Helper untuk menyimpan attachment
const saveAttachment = async (file, replyId, userId) => {
  const { fileName, filePath } = await uploadFile(file, "replies", replyId);
  
  const attachment = await Attachment.create({
    fileName,
    filePath,
    createdBy: userId
  });

  await ReplyAttachment.create({
    replyId,
    attachmentId: attachment.id,
    createdBy: userId
  });
};

// Helper untuk include relations
const includeRelations = {
  include: [
    {
      model: User,
      as: "user",
      attributes: ["id", "name", "npm"]
    },
    {
      model: ReplyAttachment,
      as: "ReplyAttachments",
      where: { deleted: false },
      include: [{
        model: Attachment,
        as: "attachment"
      }],
      required: false
    },
    {
      model: ReplyLike,
      as: "likes",
      where: { deleted: false },
      attributes: ['id', 'userId', 'likeType'],
      required: false
    }
  ]
};

const createReply = async (replyData, files) => {
  const reply = await Reply.create(replyData);
  
  if (files?.length) {
    await Promise.all(files.map(file => 
      saveAttachment(file, reply.id, replyData.createdBy)
    ));
  }
  
  return reply;
};

const getRepliesByPostId = async (postId) => {
  return Reply.findAll({
    where: { 
      postId,
      deleted: false,
      parentReplyId: null
    },
    ...includeRelations,
    order: [['createdAt', 'DESC']]
  });
};

const getRepliesByParentId = async (parentReplyId) => {
  return Reply.findAll({
    where: { 
      parentReplyId,
      deleted: false
    },
    ...includeRelations,
    order: [['createdAt', 'DESC']]
  });
};

const getReplyById = async (id) => {
  return Reply.findOne({
    where: { id, deleted: false },
    ...includeRelations
  });
};

const updateReply = async (id, data, files) => {
  const reply = await Reply.findByPk(id);
  if (!reply) throw new Error("Reply tidak ditemukan");

  await reply.update(data);

  if (files?.length) {
    await Promise.all(files.map(file => 
      saveAttachment(file, reply.id, data.updatedBy)
    ));
  }

  return reply;
};

const deleteReply = async (id, username) => {
  const reply = await Reply.findByPk(id);
  if (!reply) throw new Error("Reply tidak ditemukan");

  await reply.update({ deleted: true, updatedBy: username });

  const attachments = await ReplyAttachment.findAll({
    where: { replyId: id, deleted: false }
  });

  await Promise.all(attachments.map(attachment =>
    attachment.update({ deleted: true, updatedBy: username })
  ));

  return reply;
};

module.exports = {
  createReply,
  getRepliesByPostId,
  getRepliesByParentId,
  getReplyById,
  updateReply,
  deleteReply
}; 