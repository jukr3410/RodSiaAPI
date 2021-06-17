const express = require('express');
const router = express.Router();
const fileUpload = require('../controllers/fileUpload.controller');
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()

router.get('/file-uploads', fileUpload.displayForm); //test upload with website
router.get('/garages/images', fileUpload.getAllGarageFiles);
router.get('/garages/:id/images', fileUpload.getByGarageId);
router.get('/info-assistants/:id/images', fileUpload.getByInfoId);

// router.get('/file-uploads/:id', fileUpload.getFileUpload);
//router.post('/file-uploads', multipartMiddleware, fileUpload.uploadByGarage);
router.post('/garages/:id/file-uploads', multipartMiddleware, fileUpload.uploadByGarage);
router.post('/info-assistants/:id/file-uploads', multipartMiddleware, fileUpload.uploadByInfoAssistant);

// router.delete('/file-uploads/:id', fileUpload.deleteFileUpload);



module.exports = router;