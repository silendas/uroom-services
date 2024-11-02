"use strict";

const {
  Post,
  User,
  PostAttachment, 
  Attachment,
  PostLike,
  Reply
} = require("../models");
const { uploadFile, deleteFile } = require("../utils/fileHandler");

// Fungsi helper untuk menyimpan attachment
const saveAttachment = async (file, postId, userId) => {
  const { fileName, filePath } = await uploadFile(file, "posts", postId);
  
  const attachment = await Attachment.create({
    fileName,
    filePath, 
    createdBy: userId
  });

  await PostAttachment.create({
    postId,
    attachmentId: attachment.id,
    createdBy: userId
  });
};

// Fungsi helper untuk include relations
const includeRelations = {
  include: [
    {
      model: User,
      as: "user",
      attributes: ["id", "name", "npm"]
    },
    {
      model: PostAttachment,
      as: "PostAttachments",
      where: { deleted: false },
      include: [{
        model: Attachment,
        as: "attachment"
      }],
      required: false
    },
    {
      model: PostLike,
      as: "likes", 
      where: { deleted: false },
      attributes: ['id', 'userId', 'likeType'],
      required: false
    },
    {
      model: Reply,
      as: "replies",
      where: {
        parentReplyId: null,
        deleted: false
      },
      required: false
    }
  ]
};

const createPost = async (postData, files) => {
  const post = await Post.create(postData);
  
  if (files?.length) {
    await Promise.all(files.map(file => 
      saveAttachment(file, post.id, postData.createdBy)
    ));
  }
  
  return post;
};

const getAllPosts = async () => {
  return Post.findAll({
    where: { deleted: false },
    ...includeRelations,
    order: [['createdAt', 'DESC']]
  });
};

const getPostById = async (id) => {
  return Post.findOne({
    where: { id, deleted: false },
    ...includeRelations
  });
};

const updatePost = async (id, data, files, removedPostAttachmentIds = []) => {
  const post = await Post.findByPk(id);
  if (!post) throw new Error("Post tidak ditemukan");

  await post.update(data);

  // Handle hapus file
  if (removedPostAttachmentIds.length) {
    await Promise.all(removedPostAttachmentIds.map(async (attachId) => {
      const postAttachment = await PostAttachment.findOne({
        where: { id: attachId, postId: id, deleted: false },
        include: [{ model: Attachment, as: 'attachment' }]
      });

      if (postAttachment) {
        await Promise.all([
          postAttachment.update({ deleted: true, updatedBy: data.updatedBy }),
          postAttachment.attachment.update({ deleted: true, updatedBy: data.updatedBy }),
          deleteFile('posts', id, postAttachment.attachment.fileName)
        ]);
      }
    }));
  }

  // Handle file baru
  if (files?.length) {
    await Promise.all(files.map(file => 
      saveAttachment(file, post.id, data.updatedBy)
    ));
  }

  return post;
};

const deletePost = async (id, username) => {
  const post = await Post.findByPk(id);
  if (!post) throw new Error("Post tidak ditemukan");

  await post.update({ deleted: true, updatedBy: username });

  const attachments = await PostAttachment.findAll({
    where: { postId: id, deleted: false }
  });

  await Promise.all(attachments.map(attachment =>
    attachment.update({ deleted: true, updatedBy: username })
  ));

  return post;
};

module.exports = {
  getAllPosts,
  getPostById, 
  createPost,
  updatePost,
  deletePost
};
