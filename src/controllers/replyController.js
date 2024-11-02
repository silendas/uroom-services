'use strict';

const replyService = require('../services/replyService');
const { formatReplyResponse } = require('../response/replyResponse');

const createReply = async (req, res, next) => {
  try {
    const replyData = {
      ...req.body,
      userId: req.user.id,
      createdBy: req.user.username
    };
    
    const reply = await replyService.createReply(replyData, req.files);
    const formattedReply = formatReplyResponse(reply, req.user.id);
    
    res.status(201).json({
      status: 'success',
      data: formattedReply
    });
  } catch (error) {
    next(error);
  }
};

const getRepliesByPostId = async (req, res, next) => {
  try {
    const replies = await replyService.getRepliesByPostId(req.params.postId);
    const formattedReplies = formatReplyResponse(replies, req.user.id);
    
    res.json({
      status: 'success',
      data: formattedReplies
    });
  } catch (error) {
    next(error);
  }
};

const getRepliesByParentId = async (req, res, next) => {
  try {
    const replies = await replyService.getRepliesByParentId(req.params.parentId);
    const formattedReplies = formatReplyResponse(replies, req.user.id);
    
    res.json({
      status: 'success',
      data: formattedReplies
    });
  } catch (error) {
    next(error);
  }
};

const updateReply = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      updatedBy: req.user.username
    };
    
    const reply = await replyService.updateReply(req.params.id, data, req.files);
    const formattedReply = formatReplyResponse(reply, req.user.id);
    
    res.json({
      status: 'success',
      data: formattedReply
    });
  } catch (error) {
    next(error);
  }
};

const deleteReply = async (req, res, next) => {
  try {
    await replyService.deleteReply(req.params.id, req.user.username);
    res.json({
      status: 'success',
      message: 'Reply berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReply,
  getRepliesByPostId,
  getRepliesByParentId,
  updateReply,
  deleteReply
}; 