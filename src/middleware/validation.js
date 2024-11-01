'use strict';

const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/responseHelper');
const responseMessage = require('../utils/responseMassage');

const validateCreateUser = [
  body('npm').notEmpty().withMessage('NPM is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('email').notEmpty().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('username').notEmpty().withMessage('Username is required'),
  body('roleId').notEmpty().withMessage('Role id is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, responseMessage.BAD_REQUEST.message, responseMessage.BAD_REQUEST.status, errors.array());
    }
    next();
  },
];

const validateUpdateUser = [
  body('npm').notEmpty().withMessage('NPM is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('email').notEmpty().withMessage('Email is required'),
  body('username').notEmpty().withMessage('Username is required'),
  body('roleId').notEmpty().withMessage('Role id is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, responseMessage.BAD_REQUEST.message, responseMessage.BAD_REQUEST.status, errors.array());
    }
    next();
  },
]

const validateRegister = [
    body('npm').notEmpty().withMessage('NPM is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('email').notEmpty().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('username').notEmpty().withMessage('Username is required'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return errorResponse(res, responseMessage.BAD_REQUEST.message, responseMessage.BAD_REQUEST.status, errors.array());
      }
      next();
    },
  ];

const validateLogin = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, responseMessage.BAD_REQUEST.message, responseMessage.BAD_REQUEST.status, errors.array());
    }
    next();
  },
];

const validatePost = [
    body('title').notEmpty().withMessage('Post title is required'),
    body('content').notEmpty().withMessage('Post content is required'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return errorResponse(res, responseMessage.BAD_REQUEST.message, responseMessage.BAD_REQUEST.status, errors.array());
      }
      next();
    },
  ];

module.exports = { validateCreateUser, validateUpdateUser, validateLogin, validateRegister, validatePost };
