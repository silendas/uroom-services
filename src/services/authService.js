"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser } = require("./userService");
const { formatUserResponse } = require("../response/userResponse");
const { User, Role } = require("../models");
const { Op } = require("sequelize");
const { errorResponse } = require("../utils/responseHelper");
const responseMessage = require("../utils/responseMassage");

const registerUser = async ({ npm, name, email, password, username }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = {
    npm,
    name,
    email,
    username,
    password: hashedPassword,
    actived: true,
    roleId: 2,
    createdBy: "system"
  };
  return await createUser(userData);
};

const loginUser = async (username, password, res) => {
  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: username }],
        deleted: false
      },
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'name'],
        required: false
      }]
    });

    if (!user) {
      return errorResponse(res, "Invalid username/email", responseMessage.BAD_REQUEST.status);
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return errorResponse(res, "Invalid password", responseMessage.BAD_REQUEST.status);
    }

    if (!user.approved) {
      return errorResponse(res, "User is not approved", responseMessage.BAD_REQUEST.status);
    }

    const formatedUser = formatUserResponse(user);

    const token = jwt.sign(formatedUser, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    return { token, user: formatUserResponse(formatedUser) };
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, responseMessage.INTERNAL_SERVER_ERROR.message, responseMessage.INTERNAL_SERVER_ERROR.status, error);
  }
};

module.exports = { registerUser, loginUser };
