export function mapUserToPublicUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isActive: user.isActive,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function mapUserToAuthUser(user) {
  return mapUserToPublicUser(user);
}

export default {
  mapUserToPublicUser,
  mapUserToAuthUser,
};