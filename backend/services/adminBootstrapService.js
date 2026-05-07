import User from '../models/User.js';

const DEFAULT_ADMIN = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: '12345678',
  role: 'admin',
  isActive: true,
};

export async function ensureDefaultAdmin() {
  const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN.email });

  if (!existingAdmin) {
    await User.create(DEFAULT_ADMIN);
    console.log(`✅ Default admin account created: ${DEFAULT_ADMIN.email}`);
    return;
  }

  let needsSave = false;

  if (existingAdmin.role !== 'admin') {
    existingAdmin.role = 'admin';
    needsSave = true;
  }

  if (!existingAdmin.isActive) {
    existingAdmin.isActive = true;
    needsSave = true;
  }

  existingAdmin.password = DEFAULT_ADMIN.password;
  needsSave = true;

  if (needsSave) {
    await existingAdmin.save();
    console.log(`✅ Default admin account updated: ${DEFAULT_ADMIN.email}`);
  }
}

export default ensureDefaultAdmin;