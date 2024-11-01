'use strict';

const postService = require('../services/postService');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const responseMessage = require("../utils/responseMassage");
const { formatPostResponse } = require('../response/postResponse');

const getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    const formattedPosts = formatPostResponse(posts);
    
    return successResponse(
      res, 
      responseMessage.PROCESS_SUCCESS.message, 
      formattedPosts, 
      responseMessage.PROCESS_SUCCESS.status
    );
  } catch (error) {
    console.error('Error getting all posts:', error);
    return errorResponse(
      res, 
      responseMessage.INTERNAL_SERVER_ERROR.message, 
      responseMessage.INTERNAL_SERVER_ERROR.status
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
      createdBy: req.user.username
    };
    
    const post = await postService.createPost(postData, files);
    const formattedPost = formatPostResponse(post);
    
    return successResponse(
      res, 
      responseMessage.PROCESS_SUCCESS.message, 
      formattedPost, 
      responseMessage.PROCESS_SUCCESS.status
    );
  } catch (error) {
    console.error('Error creating post:', error);
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

    const formattedPost = formatPostResponse(post);
    return successResponse(
      res, 
      responseMessage.PROCESS_SUCCESS.message, 
      formattedPost, 
      responseMessage.PROCESS_SUCCESS.status
    );
  } catch (error) {
    console.error('Error getting post by id:', error);
    return errorResponse(
      res, 
      responseMessage.INTERNAL_SERVER_ERROR.message, 
      responseMessage.INTERNAL_SERVER_ERROR.status
    );
  }
};

const updatePost = async (req, res) => {
  try {
    const postData = {
      ...req.body,
      updatedBy: req.user.id.toString()
    };
    
    const post = await postService.updatePost(req.params.id, postData);
    const formattedPost = formatPostResponse(post);
    
    return successResponse(
      res, 
      responseMessage.PROCESS_SUCCESS.message, 
      formattedPost, 
      responseMessage.PROCESS_SUCCESS.status
    );
  } catch (error) {
    console.error('Error updating post:', error);
    return errorResponse(
      res, 
      responseMessage.BAD_REQUEST.message, 
      responseMessage.BAD_REQUEST.status
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
    console.error('Error deleting post:', error);
    return errorResponse(
      res, 
      responseMessage.BAD_REQUEST.message, 
      responseMessage.BAD_REQUEST.status
    );
  }
};

module.exports = { 
  getAllPosts, 
  getPostById, 
  createPost, 
  updatePost, 
  deletePost 
};
