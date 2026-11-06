import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    exchangeRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExchangeRequest',
      required: [true, 'Exchange request reference is required']
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reviewer is required']
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reviewee is required']
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars']
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      minlength: [5, 'Comment must be at least 5 characters'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    }
  },
  {
    timestamps: true
  }
);

// Prevent the same reviewer from submitting multiple reviews for the same exchange
reviewSchema.index({ exchangeRequest: 1, reviewer: 1 }, { unique: true });
reviewSchema.index({ reviewee: 1 });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
