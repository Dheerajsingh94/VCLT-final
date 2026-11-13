import mongoose from 'mongoose';

const roomDetailSchema = new mongoose.Schema(
  {
    roomname: {
      type: String,
      required: true,
      trim: true,
    },
    creationdate: {
      type: String,
      default: () => new Date().toLocaleString(),
    },
    participants: {
      type: [String],
      default: [],
    },
    endedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const RoomDetail = mongoose.model('RoomDetail', roomDetailSchema);
