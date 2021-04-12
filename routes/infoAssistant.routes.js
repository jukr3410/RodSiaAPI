const express = require('express');
const router = express.Router();
const infoAssistant = require('../controllers/infoAssistant.controller');

router.get('/info-assistants', infoAssistant.getAllInfoAssistant);
router.get('/info-assistants/:id', infoAssistant.getInfoAssistant);
router.post('/info-assistants', infoAssistant.addInfoAssistant);
router.put('/info-assistants/:id', infoAssistant.editInfoAssistant);
router.patch('/info-assistants/:id', infoAssistant.editInfoAssistant);
router.delete('/info-assistants/:id', infoAssistant.deleteInfoAssistant);

module.exports = router;