const express = require('express');
const router = express.Router();
const serviceType = require('../controllers/serviceType.controller');

router.get('/',serviceType.getAllServiceType);
router.get('/:id',serviceType.getServiceType);
router.post('/',serviceType.addServiceType);
router.put('/:id',serviceType.editServiceType);
router.patch('/:id',serviceType.editServiceType);
router.delete('/:id',serviceType.deleteServiceType);

module.exports = router;