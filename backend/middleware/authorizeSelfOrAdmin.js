import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export function authorizeSelfOrAdmin(paramName = 'id') {
  return asyncHandler(async (req, res, next) => {
    const user = req.currentUser || (await User.findById(req.userId).select('name email role avatar isActive').lean());

    if (!user) {
      throw new AppError('User not found', 404);
    }

    req.currentUser = user;

    const targetUserId = req.params[paramName];

    if (user.role !== 'admin' && String(user._id) !== String(targetUserId)) {
      throw new AppError('You do not have permission to access this user record.', 403);
    }

    next();
  });
}

export default authorizeSelfOrAdmin;