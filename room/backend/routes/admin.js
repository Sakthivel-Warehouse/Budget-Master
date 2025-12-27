const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Admin routes
router.get('/pending-signups', authMiddleware, adminMiddleware, adminController.getPendingSignups);
router.get('/members', authMiddleware, adminMiddleware, adminController.getAllMembers);
router.get('/stats', authMiddleware, adminMiddleware, adminController.getAdminStats);
router.get('/members/dues', authMiddleware, adminMiddleware, adminController.getMemberDues);
router.get('/invoices', authMiddleware, adminMiddleware, adminController.getInvoices);
router.post('/reminder', authMiddleware, adminMiddleware, adminController.sendReminder);

module.exports = router;
