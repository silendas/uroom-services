'use strict';

const { PostLike, Post } = require('../models');

const toggleLike = async (postId, user, likeType) => {
  try {
    // Cek apakah post exists
    const post = await Post.findByPk(postId);
    if (!post) throw new Error('Post not found');

    // Cek existing like
    const existingLike = await PostLike.findOne({
      where: { 
        postId,
        userId: user.id
      }
    });

    if (existingLike) {
      if (existingLike.likeType === likeType) {
        // Jika like type sama, hapus like
        await existingLike.destroy();
        return null;
      } else {
        // Jika like type berbeda, update like
        return await existingLike.update({ likeType });
      }
    }

    // Jika belum ada like, buat baru
    return await PostLike.create({
      postId,
      userId: user.id,
      likeType,
      createdBy: user.username
    });
  } catch (error) {
    throw error;
  }
};

const getLikesByPostId = async (postId) => {
  return await PostLike.findAll({
    where: { postId }
  });
};

module.exports = {
  toggleLike,
  getLikesByPostId
}; 