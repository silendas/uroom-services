"use strict";

const createPagination = (page, size, totalElements) => {
  const totalPages = Math.ceil(totalElements / size);
  const isFirst = page === 1;
  const isLast = page === totalPages;
  return { page, size, isFirst, isLast, totalElements, totalPages };
};

const createResponse = (message, status, data = null, errors = null) => {
  const response = { message, status };
  if (data !== null) {
    response.data = data;
  }
  if (errors !== null) {
    response.errors = errors;
  }
  return response;
};

const successResponse = (
  res,
  message,
  data,
  status = 200,
  pagination = null
) => {
  if (pagination !== null) {
    return res.status(status).json({
      message,
      status,
      pagination: createPagination(
        pagination.page,
        pagination.size,
        pagination.totalElements
      ),
      data,
    });
  }
  return res.status(status).json(createResponse(message, status, data));
};

const errorResponse = (res, message, status = 500, errors = null) => {
  if (errors instanceof Error) {
    // Handling Sequelize ValidationError
    if (errors.name === 'SequelizeValidationError' || errors.name === 'SequelizeUniqueConstraintError') {
      const validationErrors = errors.errors.map(err => ({
        msg: err.message,
        field: err.path,
        type: err.type,
        value: err.value
      }));
      
      return res.status(status).json(createResponse(message, status, null, validationErrors));
    }

    // Handling umum untuk error lainnya
    const errorDetail = {
      message: errors.message,
      ...(process.env.NODE_ENV === "development" && { stack: errors.stack })
    };
    
    return res.status(status).json(createResponse(message, status, null, errorDetail));
  }
  return res.status(status).json(createResponse(message, status, null, errors));
};

module.exports = { successResponse, errorResponse };
