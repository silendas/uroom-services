'use strict';

const formatUserResponse = (userModel) => {
  try {
    if (Array.isArray(userModel)) {
      return userModel.map(user => formatSingleUser(user));
    } else {
      return formatSingleUser(userModel);
    }
  } catch (error) {
    console.error('Error formatting user response:', error);
    return null;
  }
};

const formatSingleUser = (user) => {
  if (!user) return null;

  const { 
    id, 
    npm, 
    name, 
    email, 
    username, 
    approved, 
    actived, 
    createdAt, 
    updatedAt,
    role 
  } = user;

  // Format response
  return {
    id,
    npm,
    name,
    email,
    username,
    approved,
    actived,
    role: role ? {
      id: role.id,
      name: role.name
    } : null,
    createdAt,
    updatedAt
  };
};

module.exports = { formatUserResponse };
