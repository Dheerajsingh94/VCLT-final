import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
    },
    profile: {
      type: String,
      default: '',
    },
    birthyear: {
      type: Number,
      required: [true, 'Birth year is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    birthdate: {
      type: String,
      default: '',
    },
    contactNumber: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    status: {
      type: String,
      enum: ['activate', 'deactivate'],
      default: 'activate',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', ''],
      default: '',
    },
    captionlanguage: {
      type: String,
      default: 'Hindi',
    },
    spokenlanguage: {
      type: String,
      default: 'English',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);
