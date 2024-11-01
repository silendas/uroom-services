"use strict";

const express = require("express");
const postController = require("../controllers/postController");
const multer = require('multer');
const upload = multer({ dest: 'temp/' }); // Temporary storage
const { validatePost } = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: Post management
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     tags: [Post]
 *     summary: Retrieve a list of posts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of posts
 *       500:
 *         description: Server error
 */
router.get("/", postController.getAllPosts);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     tags: [Post]
 *     summary: Retrieve a post by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the post to retrieve
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *       404:
 *         description: Post not found
 */
router.get("/:id", postController.getPostById);

/**
 * @swagger
 * /posts:
 *   post:
 *     tags: [Post]
 *     summary: Create a new post with attachments
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: Judul post
 *               content:
 *                 type: string
 *                 description: Konten post
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Multiple file attachments (maksimum 5 file)
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *       400:
 *         description: Bad request
 */
router.post("/", 
  upload.array('files', 10), // Maksimum 10 file
  validatePost,
  postController.createPost
);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     tags: [Post]
 *     summary: Update a post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['title', 'content']
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 */
router.put("/:id", postController.updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     tags: [Post]
 *     summary: Delete a post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the post to delete
 *     responses:
 *       204:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 */
router.delete("/:id", postController.deletePost);

module.exports = router;
