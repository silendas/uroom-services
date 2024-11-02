'use strict';

const express = require('express');
const postLikeController = require('../controllers/postLikeController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Post Likes
 *   description: Endpoints for managing post likes and dislikes
 */

/**
 * @swagger
 * /post-likes/{postId}/like:
 *   post:
 *     tags: [Post Likes]
 *     description: Endpoint to manage likes/dislikes on a post. If the user hasn't given a like/dislike, a new one will be created. If it already exists, the status will be updated or deleted depending on the input.
 *     summary: Toggle like/dislike on a post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: ID of the post to like/dislike
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
 *                 description: Tipe interaksi yang diberikan (like atau dislike)
 *     responses:
 *       200:
 *         description: Like/dislike berhasil ditoggle
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: int
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Like/dislike berhasil diupdate
 *       400:
 *         description: Request tidak valid atau tipe like tidak sesuai
 *       404:
 *         description: Post tidak ditemukan
 */
router.post('/:postId/like', postLikeController.toggleLike);

module.exports = router; 