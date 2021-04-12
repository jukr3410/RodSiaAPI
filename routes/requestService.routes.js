const express = require('express');
const router = express.Router();
const requestService = require('../controllers/requestService.controller');

router.get('/request-services', requestService.getAllRequestService);
router.get('/request-services/:id', requestService.getRequestService);
router.post('/request-services', requestService.addRequestService);
router.put('/request-services/:id', requestService.editRequestService);
router.patch('/request-services/:id', requestService.editRequestService);
router.delete('/request-services/:id', requestService.deleteRequestService);

module.exports = router;