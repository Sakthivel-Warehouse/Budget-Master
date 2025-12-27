const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { authMiddleware } = require('../middleware/auth');

// Member routes
router.post('/post', authMiddleware, expenseController.postExpense);
router.get('/', authMiddleware, expenseController.getAllExpenses);
router.get('/user', authMiddleware, expenseController.getUserExpenses);
router.get('/detail/:expenseId', authMiddleware, expenseController.getExpenseById);
router.post('/mark-paid', authMiddleware, expenseController.markAsPaid);
router.get('/summary/user', authMiddleware, expenseController.getExpenseSummary);
router.get('/totals/members', authMiddleware, expenseController.getMembersTotalsToPay);

module.exports = router;
