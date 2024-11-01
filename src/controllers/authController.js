"use strict";

const { successResponse, errorResponse } = require("../utils/responseHelper");
const { registerUser, loginUser } = require('../services/authService');
const responseMessage = require("../utils/responseMassage");

const register = async (req, res) => {
  try {
    const { npm, name, email, password, username } = req.body;
    const user = await registerUser({ npm, name, email, password, username });
    return successResponse(
      res, 
      'Register Success, Please wait for approval', 
      null, 
      responseMessage.PROCESS_SUCCESS.status
    );
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse(
      res, 
      responseMessage.BAD_REQUEST.message, 
      responseMessage.BAD_REQUEST.status,
      error
    );
  }
};

const login = async (req, res) => {
  const response = await loginUser(req.body.username, req.body.password, res);
  if (response && response.token) {
    return successResponse(
      res, 
      responseMessage.PROCESS_SUCCESS.message, 
      { token: response.token, user: response.user },
      responseMessage.PROCESS_SUCCESS.status
    );
  }
};

module.exports = { register, login };
