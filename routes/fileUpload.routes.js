const express = require('express');
const router = express.Router();
const fileUpload = require('../controllers/fileUpload.controller');
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()

router.get('/file-uploads', fileUpload.displayForm);
router.get('/garages/:id/images', fileUpload.displayForm);
router.get('/garinfo-assistants/:id/images', fileUpload.displayForm);

// router.get('/file-uploads/:id', fileUpload.getFileUpload);
router.post('/garages/:id/file-uploads', multipartMiddleware, fileUpload.upload);
router.post('/info-assistants/:id/file-uploads', multipartMiddleware, fileUpload.upload);

// router.delete('/file-uploads/:id', fileUpload.deleteFileUpload);

module.exports = router;