const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existing) {
      // ensure isAdmin is true
      if (!existing.isAdmin) {
        await User.findByIdAndUpdate(existing._id, { isAdmin: true });
        console.log('Admin role updated for:', process.env.ADMIN_EMAIL);
      } else {
        console.log('Admin already exists:', process.env.ADMIN_EMAIL);
      }
      return;
    }
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: hashed,
      isAdmin: true
    });
    console.log('Admin account created:', process.env.ADMIN_EMAIL);
  } catch (err) {
    console.error('Admin seed error:', err.message);
  }
};

module.exports = seedAdmin;
