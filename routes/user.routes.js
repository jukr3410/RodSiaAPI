const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controller');

router.get('/users',user.getAllUser);
router.get('/users/:id',user.getUser);
router.post('/users',user.addUser);
router.put('/users/:id',user.editUser);
router.patch('/users/:id',user.editUser);
router.delete('/users/:id',user.deleteUser);

module.exports = router;