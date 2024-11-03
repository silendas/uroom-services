'use strict';

const dotenv = require('dotenv');

dotenv.config();

const formatPostResponse = (postModel, currentUserId) => {
  try {
    if (Array.isArray(postModel)) {
      return postModel.map(post => formatSinglePost(post, currentUserId));
    } else {
      return formatSinglePost(postModel, currentUserId);
    }
  } catch (error) {
    console.error('Error formatting post response:', error);
    return null;
  }
};

const formatSinglePost = (post, currentUserId) => {
  if (!post) return null;

  const { id, title, content, PostAttachments, createdAt, updatedAt, user, likes, replies } = post;
  
  // Format attachments dengan URL yang sesuai environment
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.PROD_URL 
    : `http://localhost:${process.env.PORT}`;

  const attachments = PostAttachments?.map(pa => ({
    id: pa.id,
    fileName: pa.attachment.fileName,
    filePath: pa.attachment.filePath,
    url: `${baseUrl}/${pa.attachment.filePath}`,
    downloadUrl: `${baseUrl}/download/${ra.attachment.filePath}`
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

  // Hitung replies
  const repliesCount = replies?.filter(reply => reply.parentReplyId === null).length || 0;

  return {
    id,
    title,
    content,
    attachments,
    author: user ? {
      id: user.id,
      name: user.name,
      npm: user.npm
    } : null,
    interactions: {
      likes: likesCount,
      dislikes: dislikesCount,
      repliesCount
    },
    createdAt,
    updatedAt
  };
};

module.exports = { formatPostResponse };