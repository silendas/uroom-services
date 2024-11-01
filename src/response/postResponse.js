'use strict';

const formatPostResponse = (postModel) => {
  try {
    if (Array.isArray(postModel)) {
      return postModel.map(post => formatSinglePost(post));
    } else {
      return formatSinglePost(postModel);
    }
  } catch (error) {
    console.error('Error formatting post response:', error);
    return null;
  }
};

const formatSinglePost = (post) => {
  if (!post) return null;

  const { id, title, content, PostAttachments, createdAt, updatedAt, user } = post;
  
  // Format attachments jika ada
  const attachments = PostAttachments?.map(pa => ({
    id: pa.attachment.id,
    fileName: pa.attachment.fileName,
    filePath: pa.attachment.filePath
  })) || [];

  // Format response
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
    createdAt,
    updatedAt
  };
};

module.exports = { formatPostResponse }; 