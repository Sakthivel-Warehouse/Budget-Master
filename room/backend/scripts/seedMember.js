const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const argv = require('yargs/yargs')(process.argv.slice(2)).argv;
const name = argv.name || 'Test Member';
const email = argv.email || 'member@example.com';
const phone = argv.phone || '+911234567890';
const password = argv.password || 'member123';

const seedMember = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('User already exists:', email);
      await mongoose.connection.close();
      return process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      password: hashed,
      role: 'member',
      isVerified: true
    });

    await user.save();
    console.log('Member created:', email, 'password:', password);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error seeding member:', err);
    process.exit(1);
  }
};

seedMember();
