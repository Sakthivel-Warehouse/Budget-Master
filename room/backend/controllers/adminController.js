const OTP = require('../models/OTP');
const User = require('../models/User');
const Expense = require('../models/Expense');
const { sendPaymentReminder } = require('../utils/emailService');

exports.getPendingSignups = async (req, res) => {
  try {
    // Get all unused OTPs (pending signups)
    const pendingSignups = await OTP.find({ isUsed: false }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      pendingSignups
    });
  } catch (error) {
    console.error('Error in getPendingSignups:', error);
    res.status(500).json({ message: 'Error fetching pending signups', error: error.message });
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    const members = await User.find({ role: 'member' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: members.length,
      members
    });
  } catch (error) {
    console.error('Error in getAllMembers:', error);
    res.status(500).json({ message: 'Error fetching members', error: error.message });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const totalMembers = await User.countDocuments({ role: 'member' });
    const pendingSignups = await OTP.countDocuments({ isUsed: false });

    res.status(200).json({
      success: true,
      stats: {
        totalMembers,
        pendingSignups
      }
    });
  } catch (error) {
    console.error('Error in getAdminStats:', error);
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

// Per-member dues summary (admin only)
exports.getMemberDues = async (req, res) => {
  try {
    // Get all members
    const members = await User.find({ role: 'member' }).select('name email phone');

    // Initialize result map
    const result = [];

    // Fetch all expenses
    const expenses = await Expense.find();

    // Precompute per-member totals
    for (const member of members) {
      const memberId = member._id.toString();
      let totalSpent = 0;
      let totalOwed = 0;

      for (const exp of expenses) {
        // amount posted by this member
        if (exp.postedBy && exp.postedBy.toString() === memberId) {
          totalSpent += exp.amount || 0;
        }

        // find if member is in splitWith
        if (Array.isArray(exp.splitWith) && exp.splitWith.length > 0) {
          const m = exp.splitWith.find(s => s.memberId && s.memberId.toString() === memberId);
          if (m && !m.isPaid) {
            totalOwed += m.share || 0;
          }
        }
      }

      result.push({
        memberId,
        name: member.name,
        email: member.email,
        phone: member.phone,
        totalSpent: Math.round(totalSpent * 100) / 100,
        totalOwed: Math.round(totalOwed * 100) / 100,
        balance: Math.round((totalSpent - totalOwed) * 100) / 100
      });
    }

    res.status(200).json({ success: true, dues: result });
  } catch (error) {
    console.error('Error in getMemberDues:', error);
    res.status(500).json({ message: 'Error fetching member dues', error: error.message });
  }
};

// Return invoice-like list of expenses with split details (admin only)
exports.getInvoices = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('postedBy', 'name email')
      .populate('splitWith.memberId', 'name email')
      .sort({ createdAt: -1 });

    const invoices = expenses.map(exp => ({
      id: exp._id,
      productName: exp.productName,
      amount: exp.amount,
      description: exp.description,
      postedBy: exp.postedBy ? { id: exp.postedBy._id, name: exp.postedBy.name, email: exp.postedBy.email } : null,
      createdAt: exp.createdAt,
      splitWith: exp.splitWith.map(s => ({
        memberId: s.memberId?._id || s.memberId,
        name: s.name,
        email: s.memberId?._doc?.email || (s.memberId && s.memberId.email) || null,
        share: s.share,
        isPaid: s.isPaid
      }))
    }));

    res.status(200).json({ success: true, invoices });
  } catch (error) {
    console.error('Error in getInvoices:', error);
    res.status(500).json({ message: 'Error fetching invoices', error: error.message });
  }
};

// Send reminder email to a member for pending dues (admin only)
exports.sendReminder = async (req, res) => {
  try {
    const { memberId } = req.body;
    if (!memberId) return res.status(400).json({ message: 'memberId required' });

    const member = await User.findById(memberId).select('name email');
    if (!member) return res.status(404).json({ message: 'Member not found' });

    // Gather pending items for this member
    const expenses = await Expense.find({ 'splitWith.memberId': member._id }).populate('postedBy', 'name email');

    const pendingItems = [];
    let totalDue = 0;

    for (const exp of expenses) {
      const s = exp.splitWith.find(sw => sw.memberId && sw.memberId.toString() === member._id.toString());
      if (s && !s.isPaid) {
        pendingItems.push({ productName: exp.productName, share: s.share, postedByName: exp.postedBy ? exp.postedBy.name : 'Unknown', createdAt: exp.createdAt });
        totalDue += s.share || 0;
      }
    }

    if (totalDue <= 0) return res.status(400).json({ message: 'No pending dues for member' });

    const emailRes = await sendPaymentReminder(member.email, member.name, Math.round(totalDue*100)/100, pendingItems);
    if (!emailRes.success) return res.status(500).json({ message: 'Failed to send reminder', error: emailRes.error });

    res.status(200).json({ success: true, message: 'Reminder sent' });
  } catch (error) {
    console.error('Error in sendReminder:', error);
    res.status(500).json({ message: 'Error sending reminder', error: error.message });
  }
};
