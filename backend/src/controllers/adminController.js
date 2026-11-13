import { User } from '../models/User.js';
import { Feedback } from '../models/Feedback.js';
import { ReactivationRequest } from '../models/ReactivationRequest.js';
import { RoomDetail } from '../models/RoomDetail.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'activate' });
    const deactivatedUsers = await User.countDocuments({ status: 'deactivate' });
    const pendingRequests = await ReactivationRequest.countDocuments({ status: 'pending' });
    const totalFeedbacks = await Feedback.countDocuments();
    const totalRooms = await RoomDetail.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        deactivatedUsers,
        pendingRequests,
        totalFeedbacks,
        totalRooms,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin stats.', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users.', error: error.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.status = user.status === 'activate' ? 'deactivate' : 'activate';
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${user.status}d successfully.`,
      user: {
        id: user._id,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle user status.', error: error.message });
  }
};

export const getReactivationRequests = async (req, res) => {
  try {
    const requests = await ReactivationRequest.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch requests.', error: error.message });
  }
};

export const resolveReactivationRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { action = 'approve' } = req.body;

    const request = await ReactivationRequest.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    if (action === 'approve') {
      // Reactivate user
      await User.findOneAndUpdate({ email: request.email }, { status: 'activate' });
      request.status = 'resolved';
    } else {
      request.status = 'rejected';
    }

    await request.save();

    res.status(200).json({
      success: true,
      message: `Request marked as ${request.status}. User account updated.`,
      request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process request.', error: error.message });
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      feedbacks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch feedbacks.', error: error.message });
  }
};
