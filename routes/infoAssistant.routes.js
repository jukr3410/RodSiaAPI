const express = require('express');
const router = express.Router();
const infoAssistant = require('../controllers/infoAssistant.controller');

router.get('/', infoAssistant.getAllInfoAssistant);
router.get('/:id', infoAssistant.getInfoAssistant);
router.post('/', infoAssistant.addInfoAssistant);
router.put('/:id', infoAssistant.editInfoAssistant);
router.patch('/:id', infoAssistant.editInfoAssistant);
router.delete('/:id', infoAssistant.deleteInfoAssistant);

module.exports = router;