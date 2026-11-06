import Review from '../models/Review.js';
import ExchangeRequest from '../models/ExchangeRequest.js';

// @desc    Submit a review after an exchange is completed
// @route   POST /api/reviews
// @access  Private
export const submitReview = async (req, res, next) => {
  try {
    const { exchangeRequestId, rating, comment } = req.body;

    if (!exchangeRequestId || rating === undefined || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide exchange ID, rating (1-5), and feedback comment.'
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a number between 1 and 5.'
      });
    }

    const exchange = await ExchangeRequest.findById(exchangeRequestId);
    if (!exchange) {
      return res.status(404).json({
        success: false,
        message: 'Exchange request not found.'
      });
    }

    // Verify exchange is completed
    if (exchange.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Reviews can only be submitted for completed exchanges.'
      });
    }

    // Verify current user was a participant
    const isSender = exchange.sender.toString() === req.user._id.toString();
    const isReceiver = exchange.receiver.toString() === req.user._id.toString();

    if (!isSender && !isReceiver) {
      return res.status(403).json({
        success: false,
        message: 'You can only review exchanges in which you participated.'
      });
    }

    // The reviewee is the other participant
    const revieweeId = isSender ? exchange.receiver : exchange.sender;

    // Check for existing review
    const existingReview = await Review.findOne({
      exchangeRequest: exchangeRequestId,
      reviewer: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this exchange.'
      });
    }

    const review = await Review.create({
      exchangeRequest: exchangeRequestId,
      reviewer: req.user._id,
      reviewee: revieweeId,
      rating: numRating,
      comment: comment.trim()
    });

    await review.populate([
      { path: 'reviewer', select: 'name college profileImage' },
      { path: 'reviewee', select: 'name college profileImage' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully! Thank you for supporting the community.',
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews received by a student
// @route   GET /api/reviews/:userId
// @access  Public
export const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name college profileImage')
      .populate('exchangeRequest', 'learningSkill offeredSkill')
      .sort({ createdAt: -1 });

    const total = reviews.length;
    const average =
      total > 0
        ? parseFloat((reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1))
        : 5.0;

    res.status(200).json({
      success: true,
      count: total,
      averageRating: average,
      reviews
    });
  } catch (error) {
    next(error);
  }
};
