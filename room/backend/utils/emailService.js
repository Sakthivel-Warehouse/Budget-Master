const nodemailer = require('nodemailer');

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
const smtpUser = process.env.SMTP_USER;
// Some providers (Google UI) display App Password grouped with spaces. Normalize by removing whitespace.
let smtpPass = process.env.SMTP_PASSWORD;
if (smtpPass && /\s/.test(smtpPass)) {
  console.warn('SMTP_PASSWORD contains whitespace — sanitizing (removing spaces)');
  smtpPass = smtpPass.replace(/\s+/g, '');
}

let transporter = null;

if (!smtpHost || !smtpUser || !smtpPass) {
  console.warn('Email not configured: SMTP_HOST, SMTP_USER or SMTP_PASSWORD missing. Emails will be logged to console.');
} else {
  // Use secure (SSL) only for port 465. For 587 use STARTTLS (secure: false, but will upgrade).
  const secure = smtpPort === 465;

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort || (secure ? 465 : 587),
    secure,
    auth: {
      user: smtpUser,
      pass: smtpPass
    },
    tls: {
      // allow self-signed certs if necessary (useful for local testing)
      rejectUnauthorized: false
    }
  });

  // Verify transporter to fail fast if SMTP is misconfigured
  transporter.verify().then(() => {
    console.log('SMTP transporter is ready');
  }).catch(err => {
    console.warn('SMTP transporter verification failed:', err && err.message ? err.message : err);
  });
}

const sendOTPEmail = async (email, otp, name) => {
  const from = smtpUser || process.env.SMTP_USER || 'no-reply@room-admin.local';

  // If transporter isn't configured, log OTP instead of throwing.
  if (!transporter) {
    console.warn(`Email disabled. OTP for ${email}: ${otp}`);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from,
      to: email,
      subject: 'Room Admin - Your OTP for Signup',
      html: `
        <h2>Welcome to Room Administration System</h2>
        <p>Hi ${name},</p>
        <p>Your OTP for signup is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
        <p>Please share this OTP with your admin to complete the signup process.</p>
        <p>Best regards,<br>Room Admin Team</p>
      `
    });
    console.log('OTP email sent to:', email, 'messageId:', info && info.messageId, 'response:', info && info.response);
  } catch (error) {
    console.error('Error sending email:', error && error.message ? error.message : error);
    // don't throw to avoid failing the signup flow; OTP is already saved in DB
  }
};

const sendAdminNotification = async (email, name, phone, otp) => {
  const from = smtpUser || process.env.SMTP_USER || 'no-reply@room-admin.local';
  // Prefer ADMIN_EMAIL, otherwise fall back to the SMTP user (useful when admin wants notifications at the sender account)
  const adminTo = process.env.ADMIN_EMAIL || smtpUser;

  if (!transporter) {
    console.warn(`Email disabled. Admin notification for ${email} (OTP: ${otp}) will not be sent.`);
    return;
  }

  if (!adminTo) {
    console.warn('ADMIN_EMAIL not set and SMTP_USER is not available; cannot send admin notification.');
    return;
  }

  if (!process.env.ADMIN_EMAIL) {
    console.warn(`ADMIN_EMAIL not set; falling back to SMTP_USER (${smtpUser}) for admin notifications.`);
  }

  try {
    const info = await transporter.sendMail({
      from,
      to: adminTo,
      subject: 'New Signup Request - Room Admin',
      html: `
        <h2>New Signup Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>OTP to share:</strong> ${otp}</p>
        <p>Please share this OTP with the user to complete their signup.</p>
      `
    });
    console.log('Admin notification sent to:', adminTo, 'messageId:', info && info.messageId, 'response:', info && info.response);
  } catch (error) {
    console.error('Error sending admin notification:', error && error.message ? error.message : error);
    // don't throw to avoid failing the signup flow
  }
};

module.exports = { sendOTPEmail, sendAdminNotification };

// Utility to send a simple test email (development only)
const sendTestEmail = async (to, subject = 'Test Email from Room Admin', html = '<p>This is a test email.</p>') => {
  const from = smtpUser || 'no-reply@room-admin.local';

  if (!transporter) {
    console.warn('sendTestEmail: transporter not configured; cannot send email');
    return { success: false, error: 'transporter_not_configured' };
  }

  try {
    const info = await transporter.sendMail({ from, to, subject, html });
    console.log('Test email sent to:', to, 'messageId:', info && info.messageId, 'response:', info && info.response);
    return { success: true, info };
  } catch (err) {
    console.error('Error sending test email:', err && err.message ? err.message : err);
    return { success: false, error: err && err.message ? err.message : 'unknown_error' };
  }
};

// Send payment reminder email to a member
const sendPaymentReminder = async (to, name, totalDue, items = []) => {
  const from = smtpUser || process.env.SMTP_USER || 'no-reply@room-admin.local';

  if (!transporter) {
    console.warn(`Email disabled. Payment reminder for ${to} (due: ${totalDue}) will not be sent.`);
    return { success: false, error: 'transporter_not_configured' };
  }

  const itemsHtml = items.map(it => `<li>${it.productName} — ₹${it.share} — posted by ${it.postedByName} on ${new Date(it.createdAt).toLocaleDateString()}</li>`).join('');

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: `Reminder: Pending dues ₹${totalDue} for Room Admin`,
      html: `
        <h3>Hi ${name},</h3>
        <p>This is a reminder that you have pending dues of <strong>₹${totalDue}</strong>.</p>
        <p>Pending items:</p>
        <ul>${itemsHtml}</ul>
        <p>Please settle the outstanding amount at your earliest convenience.</p>
        <p>Thanks,<br/>Room Admin Team</p>
      `
    });

    console.log('Payment reminder sent to:', to, 'messageId:', info && info.messageId);
    return { success: true, info };
  } catch (err) {
    console.error('Error sending payment reminder:', err && err.message ? err.message : err);
    return { success: false, error: err && err.message ? err.message : 'unknown_error' };
  }
};

module.exports = { sendOTPEmail, sendAdminNotification, sendTestEmail, sendPaymentReminder };

// Send member credentials email (sent when admin creates a member)
const sendMemberCredentials = async (email, name, temporaryPassword) => {
  const from = smtpUser || process.env.SMTP_USER || 'no-reply@room-admin.local';

  if (!transporter) {
    console.warn(`Email disabled. Member credentials for ${email}: password=${temporaryPassword}`);
    return { success: false, error: 'transporter_not_configured' };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to: email,
      subject: 'Your Room Admin account credentials',
      html: `
        <h3>Hi ${name},</h3>
        <p>An admin has created an account for you in the Room Admin system.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary password:</strong> ${temporaryPassword}</p>
        <p>Please log in and change your password after first sign-in.</p>
        <p>Thanks,<br/>Room Admin Team</p>
      `
    });

    console.log('Member credentials email sent to:', email, 'messageId:', info && info.messageId);
    return { success: true, info };
  } catch (err) {
    console.error('Error sending member credentials email:', err && err.message ? err.message : err);
    return { success: false, error: err && err.message ? err.message : 'unknown_error' };
  }
};

module.exports = { sendOTPEmail, sendAdminNotification, sendTestEmail, sendPaymentReminder, sendMemberCredentials };
