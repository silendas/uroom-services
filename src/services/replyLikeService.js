'use strict';

const { ReplyLike, Reply } = require('../models');

const toggleLike = async (replyId, user, likeType) => {
  try {
    // Cek apakah reply exists
    const reply = await Reply.findByPk(replyId);
    if (!reply) throw new Error('Reply not found');

    // Cek existing like
    const existingLike = await ReplyLike.findOne({
      where: { 
        replyId,
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
    return await ReplyLike.create({
      replyId,
      userId: user.id,
      likeType,
      createdBy: user.username
    });
  } catch (error) {
    throw error;
  }
};

const getLikesByReplyId = async (replyId) => {
  return await ReplyLike.findAll({
    where: { replyId }
  });
};

module.exports = {
  toggleLike,
  getLikesByReplyId
}; 