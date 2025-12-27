const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@room.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = new User({
      name: 'Admin',
      email: 'admin@room.com',
      phone: '+918925353149',
      password: hashedPassword,
      role: 'admin',
      isVerified: true
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@room.com');
    console.log('Password: admin123');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
