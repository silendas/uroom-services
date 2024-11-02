'use strict';

const express = require('express');
const replyController = require('../controllers/replyController');
const multer = require('multer');
const upload = multer({ dest: 'temp/' });
const { validateReply } = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reply
 *   description: Reply management
 */

/**
 * @swagger
 * /replies/post/{postId}:
 *   get:
 *     tags: [Reply]
 *     summary: Get all replies for a post
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of replies
 */
router.get('/post/:postId', replyController.getRepliesByPostId);

/**
 * @swagger
 * /replies/parent/{parentId}:
 *   get:
 *     tags: [Reply]
 *     summary: Get all replies for a parent reply
 *     parameters:
 *       - name: parentId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of child replies
 */
router.get('/parent/:parentId', replyController.getRepliesByParentId);

/**
 * @swagger
 * /replies:
 *   post:
 *     tags: [Reply]
 *     summary: Create a new reply
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - message
 *             properties:
 *               postId:
 *                 type: integer
 *               parentReplyId:
 *                 type: integer
 *               message:
 *                 type: string
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 */
router.post('/',
  upload.array('files', 5),
  validateReply,
  replyController.createReply
);

/**
 * @swagger
 * /replies/{id}:
 *   put:
 *     tags: [Reply]
 *     summary: Update a reply
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id',
  upload.array('files', 5),
  validateReply,
  replyController.updateReply
);

/**
 * @swagger
 * /replies/{id}:
 *   delete:
 *     tags: [Reply]
 *     summary: Delete a reply
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', replyController.deleteReply);

module.exports = router; 