"use strict";

const postService = require("../services/postService");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const responseMessage = require("../utils/responseMassage");
const { formatPostResponse } = require("../response/postResponse");
const fs = require("fs");

const getAllPosts = async (req, res) => {
  try {
    const { pagination = 'false', page = 1, size = 10 } = req.query;
    
    const result = await postService.getAllPosts(
      pagination,
      parseInt(page),
      parseInt(size)
    );

    if (pagination === 'true') {
      const formattedPosts = formatPostResponse(result.data, req.user.id);
      return successResponse(
        res,
        responseMessage.PROCESS_SUCCESS.message,
        formattedPosts,
        responseMessage.PROCESS_SUCCESS.status,
        result.pagination
      );
    }

    const formattedPosts = formatPostResponse(result, req.user.id);
    return successResponse(
      res,
      responseMessage.PROCESS_SUCCESS.message,
      formattedPosts,
      responseMessage.PROCESS_SUCCESS.status
    );
  } catch (error) {
    console.error("Error getting all posts:", error.message);
    return errorResponse(
      res,
      responseMessage.INTERNAL_SERVER_ERROR.message,
      responseMessage.INTERNAL_SERVER_ERROR.status,
      error
    );
  }
};

const createPost = async (req, res) => {
  try {
    const files = req.files || [];
    const postData = {
      title: req.body.title,
      content: req.body.content,
      userId: req.user.id,
      createdBy: req.user.username,
    };

    const post = await postService.createPost(postData, files);

    return successResponse(
      res,
      responseMessage.PROCESS_SUCCESS.message,
      null,
      responseMessage.PROCESS_SUCCESS.status
    );
  } catch (error) {
    console.error("Error creating post:", error.message);
    return errorResponse(
      res,
      responseMessage.BAD_REQUEST.message,
      responseMessage.BAD_REQUEST.status,
      error
    );
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);
    if (!post) {
      return errorResponse(
        res,
        responseMessage.NOT_FOUND.message,
        responseMessage.NOT_FOUND.status
      );
    }

    const formattedPost = formatPostResponse(post, req.user.id);
    return successResponse(
      res,
      responseMessage.PROCESS_SUCCESS.message,
      formattedPost,
      responseMessage.PROCESS_SUCCESS.status
    );
  } catch (error) {
    console.error("Error getting post by id:", error.message);
    return errorResponse(
      res,
      responseMessage.INTERNAL_SERVER_ERROR.message,
      responseMessage.INTERNAL_SERVER_ERROR.status,
      error
    );
  }
};

const updatePost = async (req, res) => {
  try {
    const files = req.files || [];
    console.log('Request Body:', req.body);
    
    let removedPostAttachmentIds = [];
    try {
      console.log('Raw removedPostAttachmentIds:', req.body.removedPostAttachmentIds);
      removedPostAttachmentIds = req.body.removedPostAttachmentIds 
        ? JSON.parse(req.body.removedPostAttachmentIds) 
        : [];
      console.log('Parsed removedPostAttachmentIds:', removedPostAttachmentIds);
    } catch (error) {
      console.error('Parse error:', error);
      return errorResponse(
        res,
        'Format removedPostAttachmentIds tidak valid. Harap kirim array ID dalam format JSON string',
        responseMessage.BAD_REQUEST.status,
        error
      );
    }

    if (files.length > 10) {
      return errorResponse(
        res,
        responseMessage.MAX_FILE_LIMIT.message,
        responseMessage.MAX_FILE_LIMIT.status
      );
    }

    const postData = {
      title: req.body.title,
      content: req.body.content,
      updatedBy: req.user.username,
    };

    console.log('IDs to remove:', removedPostAttachmentIds);

    const existingPost = await postService.getPostById(req.params.id);
    if (!existingPost) {
      return errorResponse(
        res,
        responseMessage.NOT_FOUND.message,
        responseMessage.NOT_FOUND.status
      );
    }

    if (existingPost.userId !== req.user.id && req.user.roleId !== 1) {
      return errorResponse(
        res,
        responseMessage.ACCESS_DENIED.message,
        responseMessage.ACCESS_DENIED.status
      );
    }

    await postService.updatePost(
      req.params.id,
      postData,
      files,
      removedPostAttachmentIds
    );

    return successResponse(
      res,
      responseMessage.PROCESS_SUCCESS.message,
      null,
      responseMessage.PROCESS_SUCCESS.status
    );
  } catch (error) {
    if (req.files) {
      req.files.forEach((file) => {
        if (file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    console.error("Error updating post:", error.message);
    return errorResponse(
      res,
      error.message || responseMessage.BAD_REQUEST.message,
      responseMessage.BAD_REQUEST.status,
      error
    );
  }
};

const deletePost = async (req, res) => {
  try {
    await postService.deletePost(req.params.id);
    return successResponse(
      res,
      responseMessage.PROCESS_SUCCESS.message,
      null,
      responseMessage.PROCESS_SUCCESS.status
    );
  } catch (error) {
    console.error("Error deleting post:", error.message);
    return errorResponse(
      res,
      responseMessage.BAD_REQUEST.message,
      responseMessage.BAD_REQUEST.status,
      error
    );
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
