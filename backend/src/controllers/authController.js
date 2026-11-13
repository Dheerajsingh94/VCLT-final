import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { OTP } from '../models/OTP.js';
import { sendOTPEmail } from '../utils/mailer.js';
import { generateToken } from '../utils/token.js';

// Helper to generate 4-digit numeric OTP
const generateOTPCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const register = async (req, res) => {
  try {
    const { username, birthyear, email, password } = req.body;

    if (!username || !birthyear || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields (username, birthyear, email, password) are required.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Hash password before saving in OTP temp store
    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = generateOTPCode();

    // Remove any previous pending registration OTPs for this email
    await OTP.deleteMany({ email: cleanEmail, purpose: 'register' });

    // Store in OTP collection with 10-minute TTL
    await OTP.create({
      email: cleanEmail,
      otp: otpCode,
      purpose: 'register',
      tempData: {
        username: username.trim(),
        birthyear: Number(birthyear),
        password: hashedPassword,
      },
    });

    // Send email
    await sendOTPEmail(cleanEmail, otpCode, 'Registration');

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email. Please verify to complete registration.',
      email: cleanEmail,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed due to a server error.',
      error: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const otpDoc = await OTP.findOne({
      email: cleanEmail,
      otp: otp.trim(),
      purpose: 'register',
    });

    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP code. Please try again.',
      });
    }

    const { username, birthyear, password } = otpDoc.tempData;

    // Check again if user was created in the meantime
    let user = await User.findOne({ email: cleanEmail });
    if (!user) {
      user = await User.create({
        username,
        birthyear,
        email: cleanEmail,
        password,
        status: 'activate',
      });
    }

    // Clean up used OTP
    await OTP.findByIdAndDelete(otpDoc._id);

    // Generate JWT
    const token = generateToken({ id: user._id, email: user.email, role: user.role });

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    res.status(201).json({
      success: true,
      message: 'Account verified and created successfully!',
      token,
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
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Verification failed.',
      error: error.message,
    });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email, purpose = 'register' } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingOtp = await OTP.findOne({ email: cleanEmail, purpose });

    if (!existingOtp && purpose === 'register') {
      return res.status(400).json({
        success: false,
        message: 'No pending registration found. Please register again.',
      });
    }

    const newOtp = generateOTPCode();

    if (existingOtp) {
      existingOtp.otp = newOtp;
      existingOtp.createdAt = new Date();
      await existingOtp.save();
    } else {
      await OTP.create({
        email: cleanEmail,
        otp: newOtp,
        purpose,
      });
    }

    await sendOTPEmail(cleanEmail, newOtp, purpose === 'register' ? 'Registration' : 'Password Reset');

    res.status(200).json({
      success: true,
      message: 'A fresh OTP has been sent to your email.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP.',
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase().trim();
    const adminPass = process.env.ADMIN_PASSWORD || 'Admin@123';

    // Check if logging in as Admin
    if (cleanEmail === adminEmail && password === adminPass) {
      const token = generateToken({ email: adminEmail, role: 'admin' });

      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'lax',
      });

      return res.status(200).json({
        success: true,
        message: 'Admin login successful.',
        token,
        user: {
          id: 'admin',
          username: 'System Administrator',
          email: adminEmail,
          role: 'admin',
          status: 'activate',
        },
      });
    }

    // Regular user login
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check if deactivated
    if (user.status === 'deactivate') {
      return res.status(403).json({
        success: false,
        deactivated: true,
        message: 'Your account is currently deactivated. Please submit a reactivation request.',
        email: user.email,
      });
    }

    const token = generateToken({ id: user._id, email: user.email, role: user.role });

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
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
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed due to a server error.',
      error: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No registered user found with this email address.',
      });
    }

    const otpCode = generateOTPCode();

    await OTP.deleteMany({ email: cleanEmail, purpose: 'password_reset' });
    await OTP.create({
      email: cleanEmail,
      otp: otpCode,
      purpose: 'password_reset',
    });

    await sendOTPEmail(cleanEmail, otpCode, 'Password Reset');

    res.status(200).json({
      success: true,
      message: 'Password reset OTP has been sent to your email.',
      email: cleanEmail,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to initiate password reset.',
      error: error.message,
    });
  }
};

export const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const otpDoc = await OTP.findOne({
      email: cleanEmail,
      otp: otp.trim(),
      purpose: 'password_reset',
    });

    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP code.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully. You may now set a new password.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'OTP verification failed.',
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, and new password are required.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const otpDoc = await OTP.findOne({
      email: cleanEmail,
      otp: otp.trim(),
      purpose: 'password_reset',
    });

    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP verification code.',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findOneAndUpdate(
      { email: cleanEmail },
      { password: hashedPassword },
      { new: true }
    );

    await OTP.findByIdAndDelete(otpDoc._id);

    const token = generateToken({ id: user._id, email: user.email, role: user.role });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully! You are now logged in.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reset password.',
      error: error.message,
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};
