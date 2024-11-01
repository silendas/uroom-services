const fs = require('fs');
const path = require('path');

// Constants for allowed folder types
const ALLOWED_FOLDERS = ['posts', 'reply', 'profile'];

// Create attachments folder if it doesn't exist
const attachmentsDir = path.join(__dirname, '../attachments');
if (!fs.existsSync(attachmentsDir)) {
  fs.mkdirSync(attachmentsDir, { recursive: true });
}

/**
 * Create file path based on type and ID
 * @param {String} type - Folder type (posts/reply/profile)
 * @param {String|Number} id - Entity ID
 * @param {String} fileName - File name
 * @returns {String} Complete file path
 */
const createFilePath = (type, id, fileName) => {
  if (!ALLOWED_FOLDERS.includes(type)) {
    throw new Error('Invalid folder type. Use: posts, reply, or profile');
  }
  return path.posix.join(type, id.toString(), fileName);
};

/**
 * Mendapatkan nama file yang unik
 * @param {String} targetDir - Directory target
 * @param {String} originalName - Nama file original
 * @returns {String} Nama file yang unik
 */
const getUniqueFileName = (targetDir, originalName) => {
  const nameWithoutExt = path.parse(originalName).name;
  const ext = path.parse(originalName).ext;
  let fileName = `${nameWithoutExt}${ext}`;
  let counter = 1;

  // Cek apakah file sudah ada, jika ada tambahkan counter
  while (fs.existsSync(path.join(targetDir, fileName))) {
    fileName = `${nameWithoutExt} (${counter})${ext}`;
    counter++;
  }

  return fileName;
};

/**
 * Upload file to attachments folder with specified structure
 * @param {Object} file - Uploaded file (from multer)
 * @param {String} type - Folder type (posts/reply/profile)
 * @param {String|Number} id - Entity ID
 * @returns {Promise<{fileName: String, filePath: String}>} Saved file path
 */
const uploadFile = async (file, type, id) => {
  try {
    // Validate folder type
    if (!ALLOWED_FOLDERS.includes(type)) {
      throw new Error('Invalid folder type. Use: posts, reply, or profile');
    }

    // Create folder structure
    const targetDir = path.join(attachmentsDir, type, id.toString());
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Dapatkan nama file yang unik
    const fileName = getUniqueFileName(targetDir, file.originalname);
    const targetPath = path.join(targetDir, fileName);

    // Move file to target folder
    await fs.promises.rename(file.path, targetPath);
    
    // Return fileName and filePath
    return {
      fileName,
      filePath: path.posix.join(type, id.toString(), fileName)
    };
  } catch (error) {
    // Hapus file temporary jika ada error
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

/**
 * Download file from attachments folder
 * @param {String} type - Folder type (posts/reply/profile)
 * @param {String|Number} id - Entity ID
 * @param {String} fileName - File name
 * @returns {Promise<Buffer>} File buffer
 */
const downloadFile = async (type, id, fileName) => {
  try {
    const filePath = createFilePath(type, id, fileName);
    const fullPath = path.join(attachmentsDir, filePath);
    const file = await fs.promises.readFile(fullPath);
    return file;
  } catch (error) {
    throw new Error(`File not found: ${error.message}`);
  }
};

/**
 * Serve file from attachments folder
 * @param {String} type - Folder type (posts/reply/profile)
 * @param {String|Number} id - Entity ID
 * @param {String} fileName - File name
 * @returns {String} Full path file
 */
const serveFile = (type, id, fileName) => {
  const filePath = createFilePath(type, id, fileName);
  const fullPath = path.join(attachmentsDir, filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error('File not found');
  }
  return fullPath;
};

/**
 * Delete file from attachments folder
 * @param {String} type - Folder type (posts/reply/profile)
 * @param {String|Number} id - Entity ID
 * @param {String} fileName - File name
 * @returns {Promise<void>}
 */
const deleteFile = async (type, id, fileName) => {
  try {
    const filePath = createFilePath(type, id, fileName);
    const fullPath = path.join(attachmentsDir, filePath);
    await fs.promises.unlink(fullPath);
  } catch (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}; 

// Export semua fungsi yang diperlukan
module.exports = {
  createFilePath,
  uploadFile,
  downloadFile,
  serveFile,
  deleteFile
};