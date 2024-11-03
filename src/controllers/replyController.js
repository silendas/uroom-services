'use strict';

const replyService = require('../services/replyService');
const { formatReplyResponse } = require('../response/replyResponse');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const responseMessage = require('../utils/responseMassage');

const createReply = async (req, res) => {
  try {
    const replyData = {
      ...req.body,
      userId: req.user.id,
      createdBy: req.user.username
    };
    
    const reply = await replyService.createReply(replyData, req.files);
    const formattedReply = formatReplyResponse(reply, req.user.id);
    
    return successResponse(
      res,
      responseMessage.PROCESS_SUCCESS.message,
      null,
      responseMessage.PROCESS_SUCCESS.status
    );
  } catch (error) {
    console.error('Error creating reply:', error.message);
    return errorResponse(
      res,
      responseMessage.BAD_REQUEST.message,
      responseMessage.BAD_REQUEST.status,
      error
    );
  }
};

const getRepliesByPostId = async (req, res) => {
  try {
    const { pagination = 'false', page = 1, size = 10 } = req.query;
    
    const result = await replyService.getRepliesByPostId(
      req.params.postId,
      pagination,
      parseInt(page),
      parseInt(size)
    );

    if (pagination === 'true') {
      const formattedReplies = formatReplyResponse(result.data, req.user.id);
      return successResponse(
        res,
        responseMessage.PROCESS_SUCCESS.message,
        formattedReplies,
        responseMessage.PROCESS_SUCCESS.status,
        result.pagination
      );
    }

    const formattedReplies = formatReplyResponse(result, req.user.id);
    return successResponse(
      res,
      responseMessage.PROCESS_SUCCESS.message,
      formattedReplies,
      responseMessage.PROCESS_SUCCESS.status
    );
  } catch (error) {
    console.error('Error getting replies by post id:', error.message);
    return errorResponse(
      res,
      responseMessage.BAD_REQUEST.message,
      responseMessage.BAD_REQUEST.status,
      error
    );
  }
};

const getRepliesByParentId = async (req, res) => {
  try {
    const replies = await replyService.getRepliesByParentId(req.params.parentId);
    const formattedReplies = formatReplyResponse(replies, req.user.id);
    
    return successResponse(
      res,
      responseMessage.PROCESS_SUCCESS.message,
      formattedReplies,
      responseMessage.PROCESS_SUCCESS.status
    );
  } catch (error) {
    console.error('Error getting replies by parent id:', error.message);
    return errorResponse(
      res,
      responseMessage.BAD_REQUEST.message,
      responseMessage.BAD_REQUEST.status,
      error
    );
  }
};

const updateReply = async (req, res) => {
  try {
    const data = {
      ...req.body,
      updatedBy: req.user.username
    };
    
    const reply = await replyService.updateReply(req.params.id, data, req.files);
    const formattedReply = formatReplyResponse(reply, req.user.id);
    
    return successResponse(
      res,
      responseMessage.PROCESS_SUCCESS.message,
      null,
      responseMessage.PROCESS_SUCCESS.status
    );
  } catch (error) {
    console.error('Error updating reply:', error.message);
    return errorResponse(
      res,
      responseMessage.BAD_REQUEST.message,
      responseMessage.BAD_REQUEST.status,
      error
    );
  }
};

const deleteReply = async (req, res) => {
  try {
    await replyService.deleteReply(req.params.id, req.user.username);
    return successResponse(
      res,
      responseMessage.PROCESS_SUCCESS.message,
      null,
      responseMessage.PROCESS_SUCCESS.status
    );
  } catch (error) {
    console.error('Error deleting reply:', error.message);
    return errorResponse(
      res,
      responseMessage.BAD_REQUEST.message,
      responseMessage.BAD_REQUEST.status,
      error
    );
  }
};

module.exports = {
  createReply,
  getRepliesByPostId,
  getRepliesByParentId,
  updateReply,
  deleteReply
}; 