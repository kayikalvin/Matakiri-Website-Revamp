#!/usr/bin/env node
/**
 * Promote a user to admin by email.
 * Usage: node scripts/promote-user.js user@example.com
 */
require('dotenv').config();
const connectDB = require('../config/database');
const User = require('../models/User');

const email = process.argv[2];
if (!email) {
  console.error('Please provide an email: node scripts/promote-user.js user@example.com');
  process.exit(1);
}

(async () => {
  try {
    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      console.error('No user found with email', email);
      process.exit(1);
    }

    user.role = 'admin';
    user.isActive = true;
    await user.save();
    console.log(`User ${email} promoted to admin.`);
    process.exit(0);
  } catch (err) {
    console.error('Error promoting user:', err.message || err);
    process.exit(1);
  }
})();
