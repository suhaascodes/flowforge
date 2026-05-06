import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { mapUserToAuthUser } from '../services/userService.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, avatar } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError('User already exists with this email', 409);
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar: avatar ?? null,
    role: 'member',
  });

  const token = generateToken(user._id);

  return sendSuccess(
    res,
    {
      token,
      user: mapUserToAuthUser(user),
    },
    'Registration successful',
    201,
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const passwordMatches = await user.comparePassword(password);

  if (!passwordMatches) {
    throw new AppError('Invalid email or password', 401);
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id);

  return sendSuccess(
    res,
    {
      token,
      user: mapUserToAuthUser(user),
    },
    'Login successful',
  );
});

export const validateToken = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return sendSuccess(res, { user: mapUserToAuthUser(user) }, 'Token is valid');
});

export const logout = asyncHandler(async (req, res) => {
  return sendSuccess(res, {}, 'Logout successful');
});

export default {
  register,
  login,
  validateToken,
  logout,
};