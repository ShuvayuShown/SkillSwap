import mongoose from 'mongoose';

export const REQUEST_STATUS = ['pending', 'accepted', 'rejected', 'cancelled', 'completed'];

const exchangeRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Request sender is required']
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Request receiver is required']
    },
    learningSkill: {
      type: String,
      required: [true, 'The skill you want to learn is required'],
      trim: true,
      maxlength: [100, 'Skill name cannot exceed 100 characters']
    },
    offeredSkill: {
      type: String,
      required: [true, 'The skill you are offering is required'],
      trim: true,
      maxlength: [100, 'Skill name cannot exceed 100 characters']
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: REQUEST_STATUS,
        message: '{VALUE} is not a valid exchange status'
      },
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

exchangeRequestSchema.index({ sender: 1, receiver: 1, status: 1 });
exchangeRequestSchema.index({ receiver: 1, status: 1 });
exchangeRequestSchema.index({ sender: 1, status: 1 });

const ExchangeRequest = mongoose.models.ExchangeRequest || mongoose.model('ExchangeRequest', exchangeRequestSchema);
export default ExchangeRequest;
