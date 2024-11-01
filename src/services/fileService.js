'use strict';

const fs = require('fs');
const path = require('path');
const { upload, allowedMimeTypes } = require('../utils/fileHelper');

class FileService {
  // Get allowed file types
  getAllowedTypes() {
    return Object.keys(allowedMimeTypes);
  }

  // Save uploaded files
  async saveFiles(files) {
    if (!files || files.length === 0) {
      throw new Error('No files uploaded');
    }

    return files.map(file => ({
      fileName: file.filename,
      filePath: path.join(file.destination, file.filename),
      fileType: file.mimetype,
      fileSize: file.size
    }));
  }

  // Validate file access
  validateFileAccess(requestUserId, fileUserId) {
    if (parseInt(fileUserId) !== requestUserId) {
      throw new Error('Unauthorized access');
    }
  }

  // Get file path and validate existence
  getFilePath(userId, fileName) {
    const filePath = `attachments/${userId}/${fileName}`;
    const absolutePath = path.resolve(filePath);
    
    if (!fs.existsSync(absolutePath)) {
      throw new Error('File not found');
    }

    return { filePath, absolutePath };
  }

  // Get file mime type
  getFileMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return Object.entries(allowedMimeTypes)
      .find(([, extension]) => `.${extension}` === ext)?.[0] || 'application/octet-stream';
  }
}

module.exports = new FileService(); 