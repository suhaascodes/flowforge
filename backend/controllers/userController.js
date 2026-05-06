import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { buildPaginationMeta, buildSearchFilter, buildSortObject, normalizePagination } from '../services/queryService.js';
import { sendPaginatedSuccess, sendSuccess } from '../utils/response.js';
import { mapUserToPublicUser } from '../services/userService.js';

export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = normalizePagination(req.query);
  const sort = buildSortObject(req.query, '-createdAt');
  const filters = {};

  if (req.query.role) {
    filters.role = req.query.role;
  }

  if (req.query.isActive !== undefined) {
    filters.isActive = req.query.isActive === 'true';
  }

  const searchFilter = buildSearchFilter(req.query.search, ['name', 'email']);
  const query = { ...filters, ...searchFilter };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).sort(sort).skip(skip).limit(limit).select('-password').lean(),
  ]);

  return sendPaginatedSuccess(res, users.map((user) => mapUserToPublicUser(user)), buildPaginationMeta({ page, limit, total }), 'Users fetched successfully');
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password').lean();

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return sendSuccess(res, { user: mapUserToPublicUser(user) }, 'User fetched successfully');
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select('-password').lean();

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return sendSuccess(res, { user: mapUserToPublicUser(user) }, 'Profile fetched successfully');
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'member', avatar = null, isActive = true } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError('User already exists with this email', 409);
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    avatar,
    isActive,
  });

  return sendSuccess(res, { user: mapUserToPublicUser(user) }, 'User created successfully', 201);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('+password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isAdmin = req.currentUser?.role === 'admin';
  const isSelf = String(req.currentUser?._id || req.userId) === String(user._id);

  if (!isAdmin && !isSelf) {
    throw new AppError('You do not have permission to update this user.', 403);
  }

  const allowedFields = isAdmin ? ['name', 'email', 'password', 'role', 'avatar', 'isActive'] : ['name', 'email', 'password', 'avatar'];

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  }

  await user.save();

  return sendSuccess(res, { user: mapUserToPublicUser(user) }, 'User updated successfully');
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (String(req.userId) === String(req.params.id)) {
    throw new AppError('You cannot delete your own account from this endpoint.', 403);
  }

  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return sendSuccess(res, { deletedId: user._id }, 'User deleted successfully');
});

export default {
  listUsers,
  getUserById,
  getProfile,
  createUser,
  updateUser,
  deleteUser,
};