import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export function authorizeRoles(...allowedRoles) {
  return asyncHandler(async (req, res, next) => {
    const user = req.currentUser || (await User.findById(req.userId).select('name email role avatar isActive').lean());

    if (!user) {
      throw new AppError('User not found', 404);
    }

    req.currentUser = user;

    if (!allowedRoles.includes(user.role)) {
      throw new AppError('You do not have permission to perform this action.', 403);
    }

    next();
  });
}

export default authorizeRoles;