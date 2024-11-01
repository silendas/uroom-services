'use strict';

const { errorResponse } = require('../utils/responseHelper');
const responseMessage = require("../utils/responseMassage");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  return errorResponse(res, responseMessage.INTERNAL_SERVER_ERROR.message, responseMessage.INTERNAL_SERVER_ERROR.status);
};

module.exports = errorHandler;
