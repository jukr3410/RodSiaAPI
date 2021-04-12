const express = require('express');
const router = express.Router();
const serviceType = require('../controllers/serviceType.controller');

router.get('/service-types',serviceType.getAllServiceType);
router.get('/service-types/:id',serviceType.getServiceType);
router.post('/service-types',serviceType.addServiceType);
router.put('/service-types/:id',serviceType.editServiceType);
router.patch('/service-types/:id',serviceType.editServiceType);
router.delete('/service-types/:id',serviceType.deleteServiceType);

module.exports = router;