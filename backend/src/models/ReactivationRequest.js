import mongoose from 'mongoose';

const reactivationRequestSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export const ReactivationRequest = mongoose.model(
  'ReactivationRequest',
  reactivationRequestSchema
);
