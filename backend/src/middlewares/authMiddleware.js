import { verifyToken } from '../utils/token.js';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing. Please log in.',
      });
    }

    const decoded = verifyToken(token);

    // If it's an admin token
    if (decoded.role === 'admin') {
      req.user = {
        _id: 'admin',
        email: decoded.email,
        username: 'Administrator',
        role: 'admin',
        status: 'activate',
      };
      return next();
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.',
      });
    }

    if (user.status === 'deactivate') {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please submit a reactivation request.',
        deactivated: true,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
      error: error.message,
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === 'admin' ||
      req.user.email === (process.env.ADMIN_EMAIL || 'admin@gmail.com'))
  ) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied: Admin privileges required.',
    });
  }
};
