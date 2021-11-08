const express = require('express');
const router = express.Router();
const requestService = require('../controllers/requestService.controller');

router.get('/request-services', requestService.getAllRequestService);
router.get('/request-services/:id', requestService.getRequestService);
router.get('/request-services/user/:id', requestService.getRequestByUserId);
router.get('/request-services/garage/:id', requestService.getRequestServiceWaitingConfirm);
router.get('/request-services/service/:id', requestService.getRequestByServiceId);
router.post('/request-services', requestService.addRequestService);
router.put('/request-services/:id', requestService.editRequestService);
router.patch('/request-services/:id', requestService.editRequestService);
router.delete('/request-services/:id', requestService.deleteRequestService);

module.exports = router;