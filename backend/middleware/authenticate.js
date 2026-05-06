import User from '../models/User.js';
import { verifyToken } from '../utils/jwt.js';

export async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired or is invalid. Please sign in again.',
      });
    }

    req.userId = decoded.userId;

    const currentUser = await User.findById(decoded.userId).select('_id name email role avatar isActive').lean();

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'Your account could not be found. Please sign in again.',
      });
    }

    req.currentUser = currentUser;
    req.auth = { userId: decoded.userId };
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Please sign in again.',
    });
  }
}

export default authenticate;
