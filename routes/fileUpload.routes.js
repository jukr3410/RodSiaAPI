const express = require('express');
const router = express.Router();
const fileUpload = require('../controllers/fileUpload.controller');
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()

router.get('/file-uploads', fileUpload.displayForm);
// router.get('/file-uploads/:id', fileUpload.getFileUpload);
router.post('/file-uploads', multipartMiddleware, fileUpload.upload);
// router.put('/file-uploads/:id', fileUpload.editFileUpload);
// router.patch('/file-uploads/:id', fileUpload.editFileUpload);
// router.delete('/file-uploads/:id', fileUpload.deleteFileUpload);

module.exports = router;