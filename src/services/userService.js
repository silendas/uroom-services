"use strict";

const { User, Role } = require("../models");
const { getDefaultFilter, getSearchUser } = require("../utils/filterRequest");
const bcrypt = require("bcrypt");

// Fungsi helper untuk include role
const roleInclude = {
  model: Role,
  as: "role", 
  attributes: ["id", "name"],
  required: false
};

// Get semua user dengan filter dan pagination
const getAllUsers = async (pagination = false, page = 1, size = 10, search, approved = null) => {
  const filter = {
    ...getDefaultFilter(),
    where: {
      ...getDefaultFilter().where,
      ...getSearchUser(search),
      ...(approved !== null && { approved })
    }
  };

  if (pagination === "true") {
    const offset = (page - 1) * size;
    const { count, rows } = await User.findAndCountAll({
      ...filter,
      include: [roleInclude],
      limit: parseInt(size),
      offset
    });

    return {
      data: rows,
      pagination: {
        page: parseInt(page),
        size: parseInt(size),
        totalElements: count,
        isFirst: page === 1,
        isLast: page >= Math.ceil(count / size)
      }
    };
  }

  return User.findAll({
    ...filter,
    include: [roleInclude]
  });
};

// Buat user baru
const createUser = async (userData, req) => {
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }
  
  return User.create({
    ...userData,
    approved: true,
    actived: true,
    createdBy: req.user.id
  });
};

// Update user
const updateUser = async (id, userData, req) => {
  if (userData.password) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    userData.password = await bcrypt.hash(userData.password, 10);
  }

  return User.update({
    ...userData,
    updatedBy: req.user.id
  }, { 
    where: { id } 
  });
};

// Hapus user (soft delete)
const deleteUser = async (id) => {
  return User.update(
    { deleted: true }, 
    { where: { id } }
  );
};

// Get user by ID
const getUserById = async (id) => {
  return User.findOne({
    where: { id, deleted: false },
    include: [roleInclude]
  });
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById
};
