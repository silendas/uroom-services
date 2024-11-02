'use strict';

const replyLikeService = require('../services/replyLikeService');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const responseMessage = require("../utils/responseMassage");

const toggleLike = async (req, res) => {
  try {
    const { replyId } = req.params;
    const { likeType } = req.body;

    await replyLikeService.toggleLike(replyId, req.user, likeType);
    
    return successResponse(
      res, 
      responseMessage.PROCESS_SUCCESS.message, 
      null,
      responseMessage.PROCESS_SUCCESS.status
    );
  } catch (error) {
    console.error('Error toggling reply like:', error.message);
    return errorResponse(
      res, 
      responseMessage.BAD_REQUEST.message, 
      responseMessage.BAD_REQUEST.status,
      error
    );
  }
};

module.exports = {
  toggleLike
}; 