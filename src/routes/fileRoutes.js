"use strict";

const express = require("express");
const path = require("path");
const { serveFile } = require("../utils/fileHandler");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Attachments
 *   description: Manajemen file dan attachment
 */

/**
 * @swagger
 * /{type}/{id}/{fileName}:
 *   get:
 *     tags: [Attachments]
 *     summary: Serve file langsung
 *     parameters:
 *       - name: type
 *         in: path
 *         required: true
 *         description: Tipe file (posts/reply/profile)
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID dari entity
 *       - name: fileName
 *         in: path
 *         required: true
 *         description: Nama file
 */
router.get("/:type/:id/:fileName", (req, res) => {
  try {
    const { type, id, fileName } = req.params;
    const filePath = serveFile(type, id, fileName);
    res.sendFile(filePath);
  } catch (error) {
    res.status(404).json({ 
      status: "error",
      message: "File tidak ditemukan" 
    });
  }
});

/**
 * @swagger
 * /download/{type}/{id}/{fileName}:
 *   get:
 *     tags: [Attachments]
 *     summary: Download file sebagai attachment
 *     parameters:
 *       - name: type
 *         in: path
 *         required: true
 *         description: Tipe file (posts/reply/profile)
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID dari entity
 *       - name: fileName
 *         in: path
 *         required: true
 *         description: Nama file
 */
router.get("/download/:type/:id/:fileName", (req, res) => {
  try {
    const { type, id, fileName } = req.params;
    const filePath = serveFile(type, id, fileName);
    res.download(filePath);
  } catch (error) {
    res.status(404).json({ 
      status: "error",
      message: "File tidak ditemukan" 
    });
  }
});

module.exports = router; 