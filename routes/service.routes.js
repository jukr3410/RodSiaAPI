const express = require('express');
const router = express.Router();
const service = require('../controllers/service.controller');

router.get('/services',service.getAllService);
router.get('/services-id/:id',service.getService);
router.get('/services-name/:name',service.getByServiceName);
router.get('/service-type/:id/services',service.getByServiceType);
router.post('/services',service.addService);
router.put('/services/:id',service.editService);
router.patch('/services/:id',service.editService);
router.delete('/services/:id',service.deleteService);

module.exports = router;