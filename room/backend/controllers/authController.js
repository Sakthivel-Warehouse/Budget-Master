const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendOTPEmail, sendAdminNotification } = require('../utils/emailService');
const { generateOTP } = require('../utils/helpers');

// Member signup - OTP sent to member's email
exports.requestOTP = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Validate input
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email, and phone are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to database
    const otpRecord = new OTP({
      name,
      email,
      phone,
      otp,
      isUsed: false
    });

    await otpRecord.save();

    // Send OTP email to member
    await sendOTPEmail(email, otp, name);

    res.status(200).json({
      message: 'OTP sent to your email. Please check your inbox (and spam).',
      success: true
    });
  } catch (error) {
    console.error('Error in requestOTP:', error);
    res.status(500).json({ message: 'Error generating OTP', error: error.message });
  }
};

// Admin signup - OTP sent to SMTP_USER email from .env
exports.adminRequestOTPSignup = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Validate input
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email, and phone are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to database (with admin flag for signup)
    const otpRecord = new OTP({
      name,
      email,
      phone,
      otp,
      isUsed: false,
      isAdminSignup: true
    });

    await otpRecord.save();

    // Send OTP to SMTP_USER email (admin inbox)
    const smtpEmail = process.env.SMTP_USER;
    if (!smtpEmail) {
      return res.status(500).json({ message: 'SMTP email not configured' });
    }

    await sendOTPEmail(smtpEmail, otp, name);

    res.status(200).json({
      message: 'OTP sent to admin email. Please check your inbox (and spam).',
      success: true,
      otpSentTo: smtpEmail
    });
  } catch (error) {
    console.error('Error in adminRequestOTPSignup:', error);
    res.status(500).json({ message: 'Error generating OTP', error: error.message });
  }
};

// Admin signup verification
exports.adminVerifyOTPSignup = async (req, res) => {
  try {
    const { name, email, phone, otp, password } = req.body;

    // Validate input
    if (!name || !email || !phone || !otp || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find OTP record (admin signup OTP)
    const otpRecord = await OTP.findOne({
      name,
      email,
      phone,
      otp,
      isUsed: false,
      isAdminSignup: true
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new admin user
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'admin',
      isVerified: true
    });

    await user.save();

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Admin account created successfully',
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in adminVerifyOTPSignup:', error);
    res.status(500).json({ message: 'Error during admin signup', error: error.message });
  }
};

// Admin login - OTP sent to admin email from .env
exports.adminRequestOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists and is admin
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Admin account not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can login here' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to database
    const otpRecord = new OTP({
      email,
      otp,
      isUsed: false
    });

    await otpRecord.save();

    // Send OTP to SMTP_USER email (for admin login)
    const smtpEmail = process.env.SMTP_USER;
    if (!smtpEmail) {
      return res.status(500).json({ message: 'SMTP email not configured' });
    }

    await sendOTPEmail(smtpEmail, otp, user.name);

    res.status(200).json({
      message: 'OTP sent to admin email. Please check your inbox (and spam).',
      success: true
    });
  } catch (error) {
    console.error('Error in adminRequestOTP:', error);
    res.status(500).json({ message: 'Error generating OTP', error: error.message });
  }
};


// Member signup with OTP
exports.verifyOTPAndSignup = async (req, res) => {
  try {
    const { name, email, phone, otp, password } = req.body;

    // Validate input
    if (!name || !email || !phone || !otp || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({
      email,
      phone,
      otp,
      isUsed: false
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'member',
      isVerified: true
    });

    await user.save();

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Signup successful',
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in verifyOTPAndSignup:', error);
    res.status(500).json({ message: 'Error during signup', error: error.message });
  }
};

// Admin login with OTP
exports.adminVerifyOTP = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    // Validate input
    if (!email || !otp || !password) {
      return res.status(400).json({ message: 'Email, OTP, and password are required' });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({
      email,
      otp,
      isUsed: false
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Find admin user
    const user = await User.findOne({ email });

    if (!user || user.role !== 'admin') {
      return res.status(401).json({ message: 'Admin account not found' });
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Admin login successful',
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Error in adminVerifyOTP:', error);
    res.status(500).json({ message: 'Error during admin login', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};
