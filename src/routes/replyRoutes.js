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
 *         description: ID dari post yang ingin diambil reply-nya
 *       - in: query
 *         name: pagination
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Aktifkan/nonaktifkan pagination
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Nomor halaman (hanya bekerja ketika pagination=true)
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *         description: Jumlah item per halaman (hanya bekerja ketika pagination=true)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar reply berhasil diambil
 *       404:
 *         description: Post tidak ditemukan
 *       500:
 *         description: Server error
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
 *                 description: ID post yang akan direply
 *               parentReplyId:
 *                 type: integer
 *                 description: ID reply parent (opsional, untuk nested reply)
 *               message:
 *                 type: string
 *                 description: Isi pesan reply
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: File attachments (maksimum 10 file)
 *     responses:
 *       201:
 *         description: Reply created successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Post not found
 */
router.post('/',
  upload.array('files', 10),
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
 *         description: ID dari reply yang akan diupdate
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: Pesan reply yang diupdate
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: File attachments baru (maksimum 5 file)
 *               removedReplyAttachmentIds:
 *                 type: string
 *                 description: |
 *                   Array ID dari reply_attachments yang akan dihapus dalam format JSON string.
 *                   Contoh: "[1,2,3]" untuk menghapus attachment dengan ID 1, 2, dan 3.
 *                   Kirim array kosong "[]" jika tidak ada yang dihapus.
 *                 example: '"[1,2,3]"'
 *     responses:
 *       200:
 *         description: Reply updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Reply not found
 *       403:
 *         description: Access denied
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