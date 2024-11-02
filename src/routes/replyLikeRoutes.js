'use strict';

const express = require('express');
const replyLikeController = require('../controllers/replyLikeController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ReplyLike
 *   description: Reply like management
 */

/**
 * @swagger
 * /reply-likes/{replyId}:
 *   post:
 *     tags: [ReplyLike]
 *     summary: Toggle like/dislike on a reply
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: replyId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the reply to like/dislike
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - likeType
 *             properties:
 *               likeType:
 *                 type: string
 *                 enum: [like, dislike]
 *                 description: Type of reaction
 *     responses:
 *       200:
 *         description: Like/dislike toggled successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Reply not found
 */
router.post('/:replyId', replyLikeController.toggleLike);

module.exports = router; 