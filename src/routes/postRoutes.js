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
 *     summary: Update a post with attachments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post to update
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
 *                 example: "Judul Post Update"
 *               content:
 *                 type: string
 *                 description: Konten post
 *                 example: "Konten post yang diupdate"
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: File attachments baru (maksimum 10 file)
 *               removedPostAttachmentIds:
 *                 type: string
 *                 description: |
 *                   Array ID dari post_attachments yang akan dihapus dalam format JSON string.
 *                   Contoh: "[1,2,3]" untuk menghapus attachment dengan ID 1, 2, dan 3.
 *                   Kirim array kosong "[]" jika tidak ada yang dihapus.
 *                 example: '"[1,2,3]"'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Post not found
 *       403:
 *         description: Access denied
 */
router.put("/:id",
  upload.array('files', 10), // Maksimum 10 file
  validatePost,
  postController.updatePost
);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     tags: [Post]
 *     summary: Soft delete a post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the post to soft delete
 *     responses:
 *       200:
 *         description: Post soft deleted successfully
 *       404:
 *         description: Post not found
 */
router.delete("/:id", postController.deletePost);

module.exports = router;
