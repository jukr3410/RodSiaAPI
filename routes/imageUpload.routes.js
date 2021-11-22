const express = require('express');
const router = express.Router();
const imageUpload = require('../controllers/imageUpload.controller');
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()

router.get('/image-uploads', imageUpload.displayForm); //test upload with website

router.post('/image-uploads/user/:phone', multipartMiddleware,  imageUpload.uploadProfileImageUserwithPhone);

router.post('/image-uploads/garage/:phone', multipartMiddleware,  imageUpload.uploadProfileImageGaragewithPhone);

router.post('/image-uploads-multi/garage/:phone/:index', multipartMiddleware, imageUpload.uploadGarageImageMultiple);



router.get('/garages/:id/images', imageUpload.getByGarageId);
router.get('/info-assistants/:id/images', imageUpload.getByInfoId);


router.post('/garages/:id/image-uploads', multipartMiddleware, imageUpload.uploadByGarage);
router.post('/info-assistants/:id/image-uploads', multipartMiddleware, imageUpload.uploadByInfoAssistant);




module.exports = router;