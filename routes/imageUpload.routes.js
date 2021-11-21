const express = require('express');
const router = express.Router();
const imageUpload = require('../controllers/imageUpload.controller');
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()

router.get('/image-uploads', imageUpload.displayForm); //test upload with website

router.get('/image-uploads/user/:phone', imageUpload.uploadProfileImageUserwithPhone);


router.get('/garages/:id/images', imageUpload.getByGarageId);
router.get('/info-assistants/:id/images', imageUpload.getByInfoId);


router.post('/garages/:id/image-uploads', multipartMiddleware, imageUpload.uploadByGarage);
router.post('/info-assistants/:id/image-uploads', multipartMiddleware, imageUpload.uploadByInfoAssistant);




module.exports = router;