'use strict';

const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/responseHelper");
const User = require("../models/userModel");
const responseMessage = require("../utils/responseMassage");

const auth = async (req, res, next) => {
  try {
    // Periksa header Authorization
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return errorResponse(
        res,
        responseMessage.NOT_LOGGED_IN.message,
        responseMessage.NOT_LOGGED_IN.status
      );
    }

    // Validasi token
    const token = authHeader.split(" ")[1];
    if (!token?.trim()) {
      return errorResponse(
        res,
        responseMessage.INVALID_TOKEN.message,
        responseMessage.INVALID_TOKEN.status
      );
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { 
      algorithms: ['HS256'],
      maxAge: '24h' // 24 Jam Kadaluarsa
    });
    
    if (!decoded?.id || typeof decoded.id !== 'number') {
      throw new Error('Invalid token payload');
    }

    // Cari user dan tambahkan validasi status
    const user = await User.findOne({
      where: { 
        id: decoded.id, 
        actived: true, 
        deleted: false 
      },
      attributes: ['id', 'npm', 'name', 'email', 'username', 'roleId']
    });

    if (!user) {
      return errorResponse(
        res,
        responseMessage.USER_NOT_FOUND.message || 'User not found',
        responseMessage.USER_NOT_FOUND.status || 404
      );
    }

    // Set user ke request object
    req.user = user.toJSON();
    req.token = token; // Menyimpan token untuk penggunaan selanjutnya jika diperlukan
    
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    
    // Berikan respons yang lebih spesifik berdasarkan jenis error
    if (error.name === 'TokenExpiredError') {
      return errorResponse(
        res,
        responseMessage.TOKEN_EXPIRED?.message || 'Token has expired',
        responseMessage.TOKEN_EXPIRED?.status || 401
      );
    }
    
    return errorResponse(
      res,
      responseMessage.INVALID_TOKEN.message,
      responseMessage.INVALID_TOKEN.status
    );
  }
};

module.exports = auth;
