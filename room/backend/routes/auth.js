const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const { sendTestEmail } = require('../utils/emailService');

// Member signup with OTP - DISABLED: member signup is now admin-only. Use admin to add members.
router.post('/request-otp', (req, res) => res.status(403).json({ message: 'Signup disabled. Please contact your admin to create an account.' }));
router.post('/verify-otp-signup', (req, res) => res.status(403).json({ message: 'Signup disabled. Please contact your admin to create an account.' }));

// Admin signup with OTP
router.post('/admin/request-otp-signup', authController.adminRequestOTPSignup);
router.post('/admin/verify-otp-signup', authController.adminVerifyOTPSignup);

// Admin login with OTP
router.post('/admin/request-otp', authController.adminRequestOTP);
router.post('/admin/verify-otp', authController.adminVerifyOTP);

// Member/Admin password login (fallback)
router.post('/login', authController.login);

// Development-only: fetch latest OTP for an email (no auth) — helpful when SMTP is not delivering
router.get('/otp/latest', async (req, res) => {
	try {
		if (process.env.NODE_ENV !== 'development') {
			return res.status(403).json({ message: 'Disabled' });
		}
		const email = req.query.email;
		if (!email) return res.status(400).json({ message: 'email query required' });
		const OTP = require('../models/OTP');
		const record = await OTP.findOne({ email }).sort({ createdAt: -1 }).lean();
		if (!record) return res.status(404).json({ message: 'No OTP found for email' });
		res.json({ success: true, otp: record.otp, createdAt: record.createdAt, isUsed: record.isUsed });
	} catch (err) {
		console.error('Error in dev otp latest:', err);
		res.status(500).json({ message: 'Error' });
	}
});

// Development-only: send a test email to verify SMTP delivery
router.post('/test-email', async (req, res) => {
	try {
		if (process.env.NODE_ENV !== 'development') {
			return res.status(403).json({ message: 'Disabled' });
		}
		const { to, subject, html } = req.body || {};
		if (!to) return res.status(400).json({ message: 'to (email) required in body' });

		const result = await sendTestEmail(to, subject, html);
		if (result.success) return res.json({ success: true, message: 'Test email sent' });
		return res.status(500).json({ success: false, error: result.error });
	} catch (err) {
		console.error('Error in test-email route:', err);
		res.status(500).json({ message: 'Error' });
	}
});

// Development-only: report basic SMTP config presence (no secrets)
router.get('/smtp-status', async (req, res) => {
	try {
		if (process.env.NODE_ENV !== 'development') {
			return res.status(403).json({ message: 'Disabled' });
		}

		const smtpHost = !!process.env.SMTP_HOST;
		const smtpPort = !!process.env.SMTP_PORT;
		const smtpUser = !!process.env.SMTP_USER;
		const smtpPass = !!process.env.SMTP_PASSWORD;
		const adminEmail = !!process.env.ADMIN_EMAIL;

		res.json({
			success: true,
			smtp: {
				hostConfigured: smtpHost,
				portConfigured: smtpPort,
				userConfigured: smtpUser,
				passConfigured: smtpPass
			},
			adminEmailConfigured: adminEmail
		});
	} catch (err) {
		console.error('Error in smtp-status:', err);
		res.status(500).json({ message: 'Error' });
	}
});

// Protected routes
router.get('/current-user', authMiddleware, authController.getCurrentUser);

module.exports = router;
