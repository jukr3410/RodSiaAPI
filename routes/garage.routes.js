const express = require('express');
const router = express.Router();
const garage = require('../controllers/garage.controller');


router.get('/garages', garage.getAllGarage);
router.get('/garages/q', garage.getAllGarageByQuery);
router.get('/garages-id/:id', garage.getGarage);
router.get('/garages-name/:name',garage.getByGarageName);
router.get('/garages-phone/:phone',garage.getGaragePhone);
router.post('/garages' ,garage.addGarage);
router.put('/garages/:id', garage.editGarage);
router.patch('/garages/:id', garage.editGarage);
router.patch('/garages/:id/open-status', garage.updateOpenStatusGarage);
router.delete('/garages/:id', garage.deleteGarage);


module.exports = router;