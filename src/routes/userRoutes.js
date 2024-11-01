"use strict";

const express = require("express");
const userController = require("../controllers/userController");
const { validateCreateUser, validateUpdateUser } = require("../middleware/validation");
const { checkAdminRole } = require("../middleware/roleCheck");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [User]
 *     summary: Retrieve a list of users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pagination
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Enable/disable pagination
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (only works when pagination=true)
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *         description: Number of items per page (only works when pagination=true)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by email, name, or username
 *       - in: query
 *         name: approved
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by approved status
 *     responses:
 *       200:
 *         description: A list of users
 *       500:
 *         description: Server error
 */
router.get("/", checkAdminRole, userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [User]
 *     summary: Retrieve a user by ID
 *     security:
 *       - bearerAuth: []  
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/:id", checkAdminRole, userController.getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     tags: [User]
 *     summary: Create a new user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               npm:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *               roleId:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", checkAdminRole, validateCreateUser, userController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [User]
 *     summary: Update a user
 *     security:
 *       - bearerAuth: []  
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               npm:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *               roleId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put("/:id", checkAdminRole, validateUpdateUser, userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [User]
 *     summary: Delete a user
 *     security:
 *       - bearerAuth: []  
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/:id", checkAdminRole, userController.deleteUser);

module.exports = router;
