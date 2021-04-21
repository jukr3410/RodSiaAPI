const express = require('express');
const router = express.Router();
const authentication = require('../controllers/authentication.controller')


router.post('/registerUser', authentication.registerUser);
router.post('/registerGarage', authentication.registerGarage);
router.get('/loginUser', authentication.loginUser);
router.get('/loginGarage', authentication.loginGarage);
router.get('/getSess', authentication.getSession);
router.get('/logout', authentication.logout);

module.exports = router;