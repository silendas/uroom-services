'use strict';

const dotenv = require('dotenv');

dotenv.config();

const formatReplyResponse = (replyModel, currentUserId) => {
  try {
    if (Array.isArray(replyModel)) {
      return replyModel.map(reply => formatSingleReply(reply, currentUserId));
    } else {
      return formatSingleReply(replyModel, currentUserId);
    }
  } catch (error) {
    console.error('Error formatting reply response:', error);
    return null;
  }
};

const formatSingleReply = (reply, currentUserId) => {
  if (!reply) return null;

  const { 
    id, 
    postId,
    parentReplyId,
    message, 
    ReplyAttachments, 
    createdAt, 
    updatedAt, 
    user, 
    likes,
    childReplies 
  } = reply;
  
  // Format attachments dengan URL yang sesuai environment
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.PROD_URL 
    : `http://localhost:${process.env.PORT}`;

  const attachments = ReplyAttachments?.map(ra => ({
    id: ra.id,
    fileName: ra.attachment.fileName,
    filePath: ra.attachment.filePath,
    url: `${baseUrl}/${ra.attachment.filePath}`
  })) || [];

  // Hitung likes dan dislikes
  const likesCount = {
    count: likes?.filter(like => like.likeType === 'like').length || 0,
    isLike: likes?.some(like => like.likeType === 'like' && like.userId === currentUserId) || false
  };

  const dislikesCount = {
    count: likes?.filter(like => like.likeType === 'dislike').length || 0,
    isDislike: likes?.some(like => like.likeType === 'dislike' && like.userId === currentUserId) || false
  };

  // Hitung child replies jika ada
  const childRepliesCount = childReplies?.length || 0;

  return {
    id,
    postId,
    parentReplyId,
    message,
    attachments,
    author: user ? {
      id: user.id,
      name: user.name,
      npm: user.npm
    } : null,
    interactions: {
      likes: likesCount,
      dislikes: dislikesCount,
      childRepliesCount
    },
    createdAt,
    updatedAt
  };
};

module.exports = { formatReplyResponse }; 