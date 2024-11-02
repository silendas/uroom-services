'use strict';

const userService = require('../services/userService');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const responseMessage = require("../utils/responseMassage");
const { formatUserResponse } = require('../response/userResponse');

const getAllUsers = async (req, res) => {
  try {
    const { pagination = 'false', search, approved, page = 1, size = 10 } = req.query;
    
    const result = await userService.getAllUsers(
      pagination,
      parseInt(page),
      parseInt(size),
      search,
      approved
    );

    if (pagination === 'true') {
      return successResponse(
        res, 
        responseMessage.PROCESS_SUCCESS.message, 
        formatUserResponse(result.data),
        responseMessage.PROCESS_SUCCESS.status,
        result.pagination
      );
    }

    return successResponse(
      res, 
      responseMessage.PROCESS_SUCCESS.message, 
      formatUserResponse(result),
      responseMessage.PROCESS_SUCCESS.status
    );
  } catch (error) {
    console.error('Error in getAllUsers:', error.message);
    return errorResponse(
      res, 
      responseMessage.INTERNAL_SERVER_ERROR.message, 
      responseMessage.INTERNAL_SERVER_ERROR.status,
      error
    );
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return errorResponse(
        res, 
        responseMessage.DATA_NOT_FOUND.message, 
        responseMessage.DATA_NOT_FOUND.status,
        { detail: `User with id ${req.params.id} not found` }
      );
    }
    return successResponse(
      res, 
      responseMessage.PROCESS_SUCCESS.message, 
      formatUserResponse(user), 
      responseMessage.PROCESS_SUCCESS.status
    );
  } catch (error) {
    console.error('Error in getUserById:', error.message);
    return errorResponse(
      res, 
      responseMessage.INTERNAL_SERVER_ERROR.message, 
      responseMessage.INTERNAL_SERVER_ERROR.status,
      error
    );
  }
};

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body, req);
    return successResponse(
      res, 
      responseMessage.PROCESS_SUCCESS.message, 
      null, 
      responseMessage.PROCESS_SUCCESS.status
    );
  } catch (error) {
    console.error('Error in createUser:', error.message);
    return errorResponse(
      res, 
      responseMessage.BAD_REQUEST.message, 
      responseMessage.BAD_REQUEST.status,
      error
    );
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req);
    if (!user) {
      return errorResponse(
        res, 
        responseMessage.NOT_FOUND.message, 
        responseMessage.NOT_FOUND.status,
        { detail: `User with id ${req.params.id} not found` }
      );
    }
    return successResponse(
      res, 
      responseMessage.PROCESS_SUCCESS.message, 
      null, 
      responseMessage.PROCESS_SUCCESS.status
    );
  } catch (error) {
    console.error('Error in updateUser:', error.message);
    return errorResponse(
      res, 
      responseMessage.BAD_REQUEST.message, 
      responseMessage.BAD_REQUEST.status,
      error
    );
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id, req);
    if (!result) {
      return errorResponse(
        res, 
        responseMessage.NOT_FOUND.message, 
        responseMessage.NOT_FOUND.status,
        { detail: `User with id ${req.params.id} not found` }
      );
    }
    return successResponse(
      res, 
      responseMessage.PROCESS_SUCCESS.message, 
      null, 
      responseMessage.PROCESS_SUCCESS.status
    );
  } catch (error) {
    console.error('Error in deleteUser:', error.message);
    return errorResponse(
      res, 
      responseMessage.BAD_REQUEST.message, 
      responseMessage.BAD_REQUEST.status,
      error
    );
  }
};

module.exports = { getAllUsers, createUser, updateUser, deleteUser, getUserById };
