const express = require('express');
const router = express.Router();
const garage = require('../controllers/garage.controller');

router.get('/', garage.getAllGarage);
router.get('/:id', garage.getGarage);
router.post('/', garage.addGarage);
router.put('/:id', garage.editGarage);
router.patch('/:id', garage.editGarage);
router.delete('/:id', garage.deleteGarage);

module.exports = router;