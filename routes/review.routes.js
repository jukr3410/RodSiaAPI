const express = require('express');
const router = express.Router();
const review = require('../controllers/review.controller');



router.get('/reviews', review.getAllReview);
router.get('/reviews/:id', review.getReview);
router.post('/reviews', review.addReview);
router.put('/reviews/:id', review.editReview);
router.patch('/reviews/:id', review.editReview);
router.delete('/reviews/:id', review.deleteReview);

module.exports = router;