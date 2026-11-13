import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Feedback } from '../models/Feedback.js';
import { ReactivationRequest } from '../models/ReactivationRequest.js';
import { RoomDetail } from '../models/RoomDetail.js';
import { SUPPORTED_LANGUAGES, getSpeechCode, getCaptionCode } from '../utils/languages.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      user,
      speechCode: getSpeechCode(user.spokenlanguage),
      captionCode: getCaptionCode(user.captionlanguage),
      supportedLanguages: SUPPORTED_LANGUAGES,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving profile.', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      username,
      birthdate,
      birthyear,
      contactNumber,
      address,
      gender,
      currentPassword,
      newPassword,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (username) user.username = username.trim();
    if (birthdate !== undefined) user.birthdate = birthdate;
    if (birthyear) user.birthyear = Number(birthyear);
    if (contactNumber !== undefined) user.contactNumber = contactNumber;
    if (address !== undefined) user.address = address;
    if (gender !== undefined) user.gender = gender;

    // Password change request
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to set a new password.',
        });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect current password.',
        });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        birthyear: user.birthyear,
        birthdate: user.birthdate,
        contactNumber: user.contactNumber,
        address: user.address,
        gender: user.gender,
        spokenlanguage: user.spokenlanguage,
        captionlanguage: user.captionlanguage,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile.', error: error.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload.' });
    }

    const filename = req.file.filename;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profile: filename },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully.',
      profileUrl: `/uploads/${filename}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to upload profile picture.', error: error.message });
  }
};

export const updateLanguages = async (req, res) => {
  try {
    const { spokenlanguage, captionlanguage } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (spokenlanguage) user.spokenlanguage = spokenlanguage;
    if (captionlanguage) user.captionlanguage = captionlanguage;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Language preferences saved.',
      spokenlanguage: user.spokenlanguage,
      captionlanguage: user.captionlanguage,
      speechCode: getSpeechCode(user.spokenlanguage),
      captionCode: getCaptionCode(user.captionlanguage),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update languages.', error: error.message });
  }
};

export const getLanguages = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      spokenlanguage: user ? user.spokenlanguage : 'English',
      captionlanguage: user ? user.captionlanguage : 'Hindi',
      speechCode: getSpeechCode(user ? user.spokenlanguage : 'English'),
      captionCode: getCaptionCode(user ? user.captionlanguage : 'Hindi'),
      supportedLanguages: SUPPORTED_LANGUAGES,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch languages.', error: error.message });
  }
};

export const deactivateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.status = 'deactivate';
    await user.save();

    res.clearCookie('jwt');

    res.status(200).json({
      success: true,
      message: 'Your account has been deactivated.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to deactivate account.', error: error.message });
  }
};

export const sendReactivationRequest = async (req, res) => {
  try {
    const { email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Email and request message are required.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account associated with this email address.',
      });
    }

    await ReactivationRequest.create({
      email: cleanEmail,
      message: message.trim(),
    });

    res.status(200).json({
      success: true,
      message: 'Reactivation request submitted to admin successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit reactivation request.', error: error.message });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { rating, feedbackmessage } = req.body;
    const email = req.user.email;

    if (!rating || !feedbackmessage) {
      return res.status(400).json({
        success: false,
        message: 'Rating and feedback message are required.',
      });
    }

    const feedback = await Feedback.create({
      email,
      rating: Number(rating),
      feedbackmessage: feedbackmessage.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your valuable feedback!',
      feedback,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit feedback.', error: error.message });
  }
};

export const getUserCallHistory = async (req, res) => {
  try {
    const userIdentifier = req.user.email || req.user.username;

    // Find rooms where this user participated
    const history = await RoomDetail.find({
      participants: { $in: [userIdentifier, req.user.username, req.user.email] },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch call history.', error: error.message });
  }
};
