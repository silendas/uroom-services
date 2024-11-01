"use strict";

const { User, Role } = require("../models");
const { getDefaultFilter, getSearchUser } = require("../utils/filterRequest");
const bcrypt = require("bcrypt");

const getAllUsers = async (pagination = false, page = 1, size = 10, search, approved = null) => {
  const defaultFilter = getDefaultFilter();
  
  defaultFilter.where = {
    ...defaultFilter.where,
    ...getSearchUser(search)
  };
  
  if (approved !== null) {
    defaultFilter.where.approved = approved;
  }

  const includeRole = {
    model: Role,
    as: "role",
    attributes: ["id", "name"],
    required: false,
  };

  if (pagination === "true") {
    const offset = (page - 1) * size;
    const { count, rows } = await User.findAndCountAll({
      ...defaultFilter,
      include: [includeRole],
      limit: parseInt(size),
      offset: offset,
    });

    return {
      data: rows,
      pagination: {
        page: parseInt(page),
        size: parseInt(size),
        totalElements: count,
        isFirst: page === 1,
        isLast: page >= Math.ceil(count / size),
      },
    };
  } else {
    const users = await User.findAll({
      ...defaultFilter,
      include: [includeRole],
    });
    return users;
  }
};

const createUser = async (userData, req) => {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    
    return await User.create({
      ...userData,
      approved: true,
      actived: true,
      createdBy: req.user.id,
    });
};

const updateUser = async (id, userData, req) => {
  if (userData.password) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    userData.password = await bcrypt.hash(userData.password, 10);
  }

  return await User.update({
    ...userData,
    updatedBy: req.user.id, 
  }, { 
    where: { id } 
  });
};

const deleteUser = async (id, req) => {
  return await User.update({ deleted: true }, { 
    where: { id },
  });
};

const getUserById = async (id) => {
  return await User.findOne({
    where: { id, deleted: false },
    include: [
      {
        model: Role,
        as: "role",
        attributes: ["id", "name"],
      },
    ],
  });
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
};
