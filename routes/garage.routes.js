const express = require('express');
const router = express.Router();
const garage = require('../controllers/garage.controller');


router.get('/garages', garage.getAllGarage);
router.get('/garages-id/:id', garage.getGarage);
router.get('/garages-name/:name',garage.getByGarageName);
router.post('/garages' ,garage.addGarage);
router.put('/garages/:id', garage.editGarage);
router.patch('/garages/:id', garage.editGarage);
router.delete('/garages/:id', garage.deleteGarage);


module.exports = router;