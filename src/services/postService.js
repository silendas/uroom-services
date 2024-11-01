'use strict';

const { Post, User, PostAttachment, Attachment } = require('../models');
const { uploadFile } = require('../utils/fileHandler');

const createPost = async (postData, files) => {
  try {
    // Tambahkan created_by dari userId
    const post = await Post.create({
      ...postData
    });
    
    // Upload dan simpan attachments jika ada
    if (files && files.length > 0) {
      for (const file of files) {
        const { fileName, filePath } = await uploadFile(file, 'posts', post.id);
        
        // Simpan attachment dengan created_by
        const attachment = await Attachment.create({
          fileName,
          filePath,
          createdBy: postData.createdBy
        });
        
        // Buat relasi di post_attachments dengan created_by
        await PostAttachment.create({
          postId: post.id,
          attachmentId: attachment.id,
          createdBy: postData.createdBy
        });
      }
    }
    
    // Ambil post dengan attachments
    return await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'npm']
        },
        {
          model: PostAttachment,
          as: 'PostAttachments',
          include: [{
            model: Attachment,
            as: 'attachment'
          }]
        }
      ]
    });
  } catch (error) {
    throw error;
  }
};

const getAllPosts = async () => {
  return await Post.findAll({
    include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'npm']
        },
        {
          model: PostAttachment,
          as: 'PostAttachments',
          include: [{
            model: Attachment,
            as: 'attachment'
          }]
        }
      ]
  });
};

const getPostById = async (id) => {
  return await Post.findOne({ 
    where: { id },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'npm']
      },
      {
        model: PostAttachment,
        as: 'PostAttachments',
        include: [{
          model: Attachment,
          as: 'attachment'
        }]
      }
    ]
  });
};

const updatePost = async (id, data) => {
  const post = await Post.findByPk(id);
  if (!post) throw new Error('Post not found');
  return await post.update(data);
};

const deletePost = async (id) => {
  const post = await Post.findByPk(id);
  if (!post) throw new Error('Post not found');
  return await post.destroy();
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};
