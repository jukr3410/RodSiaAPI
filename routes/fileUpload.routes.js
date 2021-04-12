const express = require('express');
const router = express.Router();
const fileUpload = require('../controllers/fileUpload.controller');

router.get('/file-uploads', fileUpload.getAllFileUpload);
router.get('/file-uploads/:id', fileUpload.getFileUpload);
router.post('/file-uploads', fileUpload.addFileUpload);
router.put('/file-uploads/:id', fileUpload.editFileUpload);
router.patch('/file-uploads/:id', fileUpload.editFileUpload);
router.delete('/file-uploads/:id', fileUpload.deleteFileUpload);

module.exports = router;