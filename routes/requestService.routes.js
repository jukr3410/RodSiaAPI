const express = require('express');
const router = express.Router();
const requestService = require('../controllers/requestService.controller');

router.get('/', requestService.getAllRequestService);
router.get('/:id', requestService.getRequestService);
router.post('/', requestService.addRequestService);
router.put('/:id', requestService.editRequestService);
router.patch('/:id', requestService.editRequestService);
router.delete('/:id', requestService.deleteRequestService);

module.exports = router;