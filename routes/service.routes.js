const express = require('express');
const router = express.Router();
const service = require('../controllers/service.controller');

router.get('/services',service.getAllService);
router.get('/services/:id',service.getService);
router.get('/service-type/:id/services',service.getByServiceType);

router.post('/',service.addService);
router.put('/:id',service.editService);
router.patch('/:id',service.editService);
router.delete('/:id',service.deleteService);

module.exports = router;