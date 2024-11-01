"use strict";

const { errorResponse } = require("../utils/responseHelper");
const responseMessage = require("../utils/responseMassage");

const checkAdminRole = (req, res, next) => {
  try {
    if (req.user.roleId !== 1) {
      return errorResponse(
        res,
        responseMessage.NOT_ACCESS.message,
        responseMessage.NOT_ACCESS.status
      );
    }
    next();
  } catch (error) {
    return errorResponse(
      res,
      responseMessage.INTERNAL_SERVER_ERROR.message,
      responseMessage.INTERNAL_SERVER_ERROR.status
    );
  }
};

module.exports = { checkAdminRole }; 