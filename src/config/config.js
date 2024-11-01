'use strict';

const dotenv = require('dotenv');

dotenv.config();

const config = {
  db: {
    database: process.env.NODE_ENV === 'production' ? process.env.DB_DATABASE_PROD : process.env.DB_DATABASE_DEV,
    username: process.env.NODE_ENV === 'production' ? process.env.DB_USERNAME_PROD : process.env.DB_USERNAME_DEV,
    password: process.env.NODE_ENV === 'production' ? process.env.DB_PASSWORD_PROD : process.env.DB_PASSWORD_DEV,
    host: process.env.NODE_ENV === 'production' ? process.env.DB_HOST_PROD : process.env.DB_HOST_DEV,
    dialect: process.env.NODE_ENV === 'production' ? process.env.DB_DIALECT_PROD : process.env.DB_DIALECT_DEV,
  },
  port: process.env.PORT,
};

module.exports = config;
