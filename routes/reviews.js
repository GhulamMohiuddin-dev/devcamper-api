const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviews');
const Review = require('../models/Reviews');
const { protect, authorize } = require('../middlewares/auth');
const advancedResults = require('../middlewares/advancedResults');

router
  .route('/')
  .get(advancedResults(Review), getReviews)
  .post(protect, authorize('user', 'admin'), createReview);
router
  .route('/:id')
  .get(getReview)
  .put(protect, authorize('user', 'admin'), updateReview)
  .delete(protect, authorize('user', 'admin'), deleteReview);

module.exports = router;
