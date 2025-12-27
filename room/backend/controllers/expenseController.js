const Expense = require('../models/Expense');
const User = require('../models/User');
const { generateShareAmount } = require('../utils/helpers');

exports.postExpense = async (req, res) => {
  try {
    const { productName, amount, description, invoiceImage, splitWith } = req.body;

    if (!productName || !amount || !invoiceImage || !splitWith || splitWith.length === 0) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Calculate share for each member
    const shareAmount = generateShareAmount(amount, splitWith.length);

    const splitData = splitWith.map(member => ({
      memberId: member.memberId,
      name: member.name,
      share: shareAmount,
      isPaid: false
    }));

    // Create expense
    const expense = new Expense({
      productName,
      amount,
      description,
      invoiceImage,
      postedBy: req.userId,
      splitWith: splitData,
      status: 'pending'
    });

    await expense.save();

    res.status(201).json({
      message: 'Expense posted successfully',
      success: true,
      expense
    });
  } catch (error) {
    console.error('Error in postExpense:', error);
    res.status(500).json({ message: 'Error posting expense', error: error.message });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('postedBy', 'name email phone')
      .populate('splitWith.memberId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      expenses
    });
  } catch (error) {
    console.error('Error in getAllExpenses:', error);
    res.status(500).json({ message: 'Error fetching expenses', error: error.message });
  }
};

exports.getExpenseById = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId)
      .populate('postedBy', 'name email phone')
      .populate('splitWith.memberId', 'name email phone');

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({
      success: true,
      expense
    });
  } catch (error) {
    console.error('Error in getExpenseById:', error);
    res.status(500).json({ message: 'Error fetching expense', error: error.message });
  }
};

exports.getUserExpenses = async (req, res) => {
  try {
    // Expenses posted by user
    const postedExpenses = await Expense.find({ postedBy: req.userId })
      .populate('postedBy', 'name email phone')
      .populate('splitWith.memberId', 'name email phone')
      .sort({ createdAt: -1 });

    // Expenses where user is a member
    const sharedExpenses = await Expense.find({
      'splitWith.memberId': req.userId
    })
      .populate('postedBy', 'name email phone')
      .populate('splitWith.memberId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      postedExpenses,
      sharedExpenses
    });
  } catch (error) {
    console.error('Error in getUserExpenses:', error);
    res.status(500).json({ message: 'Error fetching expenses', error: error.message });
  }
};

exports.markAsPaid = async (req, res) => {
  try {
    const { expenseId, memberId } = req.body;

    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Find and update the specific member's payment status
    const memberIndex = expense.splitWith.findIndex(
      member => member.memberId.toString() === memberId
    );

    if (memberIndex === -1) {
      return res.status(404).json({ message: 'Member not found in expense' });
    }

    expense.splitWith[memberIndex].isPaid = !expense.splitWith[memberIndex].isPaid;

    // Update expense status
    const allPaid = expense.splitWith.every(member => member.isPaid);
    const somePaid = expense.splitWith.some(member => member.isPaid);

    if (allPaid) {
      expense.status = 'settled';
    } else if (somePaid) {
      expense.status = 'partially_paid';
    } else {
      expense.status = 'unpaid';
    }

    await expense.save();

    res.status(200).json({
      message: 'Payment marked as paid',
      success: true,
      expense
    });
  } catch (error) {
    console.error('Error in markAsPaid:', error);
    res.status(500).json({ message: 'Error updating payment status', error: error.message });
  }
};

exports.getExpenseSummary = async (req, res) => {
  try {
    const userId = req.userId;

    // Get all expenses where user is involved
    const expenses = await Expense.find({
      $or: [
        { postedBy: userId },
        { 'splitWith.memberId': userId }
      ]
    });

    let totalSpent = 0;
    let totalOwed = 0;

    expenses.forEach(expense => {
      // User posted this expense
      if (expense.postedBy.toString() === userId) {
        totalSpent += expense.amount;
      }

      // User is a member in this expense
      const memberData = expense.splitWith.find(
        member => member.memberId.toString() === userId
      );

      if (memberData && !memberData.isPaid) {
        totalOwed += memberData.share;
      }
    });

    res.status(200).json({
      success: true,
      summary: {
        totalSpent: Math.round(totalSpent * 100) / 100,
        totalOwed: Math.round(totalOwed * 100) / 100,
        balance: Math.round((totalSpent - totalOwed) * 100) / 100
      }
    });
  } catch (error) {
    console.error('Error in getExpenseSummary:', error);
    res.status(500).json({ message: 'Error fetching summary', error: error.message });
  }
};

exports.getMembersTotalsToPay = async (req, res) => {
  try {
    const userId = req.userId;

    // Get all expenses where the current user is a member
    const expenses = await Expense.find({
      'splitWith.memberId': userId
    })
      .populate('splitWith.memberId', 'name email phone')
      .populate('postedBy', 'name email phone');

    let totalToPay = 0;
    const breakdown = [];

    expenses.forEach(expense => {
      // Find the current user's share in this expense
      const userShare = expense.splitWith.find(
        member => member.memberId._id.toString() === userId
      );

      if (userShare && !userShare.isPaid) {
        totalToPay += userShare.share;
        breakdown.push({
          expenseId: expense._id,
          memberId: userId,
          productName: expense.productName,
          amount: expense.amount,
          userShare: Math.round(userShare.share * 100) / 100,
          postedBy: expense.postedBy.name,
          description: expense.description,
          createdAt: expense.createdAt
        });
      }
    });

    res.status(200).json({
      success: true,
      totalToPay: Math.round(totalToPay * 100) / 100,
      breakdown
    });
  } catch (error) {
    console.error('Error in getMembersTotalsToPay:', error);
    res.status(500).json({ message: 'Error fetching members totals', error: error.message });
  }
};
