const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Admin routes
// Any authenticated user should be able to fetch the members list
router.get('/', authMiddleware, memberController.getAllMembers);
// Development-only public members endpoint (no auth) — only available in development mode
router.get('/public', async (req, res) => {
	try {
		if (process.env.NODE_ENV !== 'development') {
			return res.status(403).json({ message: 'Public members endpoint disabled' });
		}
		const members = await require('../models/User').find({ role: 'member' }).select('-password');
		res.status(200).json({ success: true, members });
	} catch (error) {
		console.error('Error in public members endpoint:', error);
		res.status(500).json({ message: 'Error fetching members', error: error.message });
	}
});
router.post('/add', authMiddleware, adminMiddleware, memberController.addMember);
router.delete('/:memberId', authMiddleware, adminMiddleware, memberController.removeMember);

// Member routes (anyone can view member details)
router.get('/:memberId', authMiddleware, memberController.getMemberById);

module.exports = router;
