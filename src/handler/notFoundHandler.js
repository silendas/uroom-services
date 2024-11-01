'use strict';

const { errorResponse } = require('../utils/responseHelper');
const responseMessage = require("../utils/responseMassage");

const notFound = (req, res, next) => {
  return errorResponse(res, responseMessage.NOT_FOUND.message, responseMessage.NOT_FOUND.status);
};

module.exports = notFound;
