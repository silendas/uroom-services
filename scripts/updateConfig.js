const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Buat konfigurasi berdasarkan environment variables
const config = {
  development: {
    username: process.env.DB_USERNAME_DEV || "root",
    password: process.env.DB_PASSWORD_DEV || null,
    database: process.env.DB_DATABASE_DEV || "db_uroom",
    host: process.env.DB_HOST_DEV || "127.0.0.1",
    dialect: process.env.DB_DIALECT_DEV || "mysql"
  },
  test: {
    username: process.env.DB_USERNAME_DEV || "root",
    password: process.env.DB_PASSWORD_DEV || null,
    database: process.env.DB_DATABASE_DEV || "db_uroom",
    host: process.env.DB_HOST_DEV || "127.0.0.1",
    dialect: process.env.DB_DIALECT_DEV || "mysql"
  },
  production: {
    username: process.env.DB_USERNAME_PROD || "root",
    password: process.env.DB_PASSWORD_PROD || null,
    database: process.env.DB_DATABASE_PROD || "db_uroom",
    host: process.env.DB_HOST_PROD || "127.0.0.1",
    dialect: process.env.DB_DIALECT_PROD || "mysql"
  }
};

// Tulis ke config.json
fs.writeFileSync(
  path.join(__dirname, '../config/config.json'),
  JSON.stringify(config, null, 2),
  'utf8'
);

console.log('Config.json berhasil diperbarui!'); 