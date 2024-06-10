const express = require('express');
const router = express.Router();
const simpleReviewController = require('../controllers/ReviewController');

router.post('/ratings', simpleReviewController.createSimpleReview);
router.get('/ratings', simpleReviewController.getAllSimpleReviews);
router.get('/ratings/:id', simpleReviewController.getSimpleReviewById);
router.put('/ratings/:id', simpleReviewController.updateSimpleReview);
router.delete('/ratings/:id', simpleReviewController.deleteSimpleReview);

module.exports = router;