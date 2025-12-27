const User = require('../models/User');

exports.getAllMembers = async (req, res) => {
  try {
    // Debugging log: who is requesting the members list
    console.log('getAllMembers requested by:', req.userId, 'role:', req.userRole);
    const members = await User.find({ role: 'member' }).select('-password');

    res.status(200).json({
      success: true,
      members
    });
  } catch (error) {
    console.error('Error in getAllMembers:', error);
    res.status(500).json({ message: 'Error fetching members', error: error.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

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

    // Create new member with temporary password
    const temporaryPassword = Math.random().toString(36).slice(-10);
    const bcryptjs = require('bcryptjs');
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(temporaryPassword, salt);

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'member',
      isVerified: true
    });

    await user.save();

    // Send temporary credentials to the member via email
    try {
      const { sendMemberCredentials } = require('../utils/emailService');
      await sendMemberCredentials(email, name, temporaryPassword);
    } catch (e) {
      console.warn('Failed to send member credentials email:', e && e.message ? e.message : e);
    }

    res.status(201).json({
      message: 'Member added successfully',
      success: true,
      member: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in addMember:', error);
    res.status(500).json({ message: 'Error adding member', error: error.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    const user = await User.findByIdAndDelete(memberId);

    if (!user) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json({
      message: 'Member removed successfully',
      success: true
    });
  } catch (error) {
    console.error('Error in removeMember:', error);
    res.status(500).json({ message: 'Error removing member', error: error.message });
  }
};

exports.getMemberById = async (req, res) => {
  try {
    const { memberId } = req.params;

    const user = await User.findById(memberId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json({
      success: true,
      member: user
    });
  } catch (error) {
    console.error('Error in getMemberById:', error);
    res.status(500).json({ message: 'Error fetching member', error: error.message });
  }
};
