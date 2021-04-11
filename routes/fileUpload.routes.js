const express = require('express');
const router = express.Router();
const fileUpload = require('../controllers/fileUpload.controller');

router.get('/', fileUpload.getAllFileUpload);
router.get('/:id', fileUpload.getFileUpload);
router.post('/', fileUpload.addFileUpload);
router.put('/:id', fileUpload.editFileUpload);
router.patch('/:id', fileUpload.editFileUpload);
router.delete('/:id', fileUpload.deleteFileUpload);

module.exports = router;