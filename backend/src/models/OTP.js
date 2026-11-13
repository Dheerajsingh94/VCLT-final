import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ['register', 'password_reset'],
      default: 'register',
    },
    tempData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // Document automatically removed after 10 minutes
    },
  },
  {
    timestamps: true,
  }
);

export const OTP = mongoose.model('OTP', otpSchema);
