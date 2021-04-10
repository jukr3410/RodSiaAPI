const express = require('express');
const router = express.Router();

const service = require('../controllers/service.controller');

router.get('/',service.getAllService);
router.get('/:id',service.getService);
router.post('/',service.addService);
router.put('/:id',service.editService);
router.patch('/:id',service.editService);
router.delete('/:id',service.deleteService);

module.exports = router;