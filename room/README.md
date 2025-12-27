# Room Administration System

A complete bachelor's room expense management application built with React, Node.js, Express, and MongoDB.

## Features

### For Members:
- **OTP-based Signup**: Request OTP via email (admin shares OTP)
- **Post Expenses**: Add product details, amount, and invoice image
- **Split Expenses**: Divide expenses among members
- **Track Payments**: View who has paid and who owes
- **Expense Summary**: See total spent, owed, and balance
- **Payment History**: View all expenses and payment status

### For Admin:
- **Add Members**: Manually add new members to the system
- **Manage OTP**: View pending signups and share OTPs
- **View Members**: See all registered members
- **Admin Stats**: Dashboard with key metrics
- **Member Management**: Add or remove members

## Tech Stack

### Backend:
- Node.js + Express.js
- MongoDB
- JWT Authentication
- Nodemailer (Email service)
- bcryptjs (Password hashing)

### Frontend:
- React 18
- React Router
- Tailwind CSS
- Axios
- React Toastify
- Lucide Icons

## Installation & Setup

### Backend Setup:

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/room-admin
JWT_SECRET=your_secure_jwt_secret_key
ADMIN_EMAIL=your_admin_email@gmail.com
ADMIN_PHONE=+91XXXXXXXXXX
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

5. Make sure MongoDB is running locally or update MONGODB_URI to your remote database

6. Start the backend server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup:

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (or use default localhost):
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

App will open at `http://localhost:3000`

## Project Structure

### Backend:
```
backend/
├── models/
│   ├── User.js
│   ├── OTP.js
│   ├── Expense.js
│   └── Payment.js
├── routes/
│   ├── auth.js
│   ├── members.js
│   ├── expenses.js
│   └── admin.js
├── controllers/
│   ├── authController.js
│   ├── memberController.js
│   ├── expenseController.js
│   └── adminController.js
├── middleware/
│   └── auth.js
├── utils/
│   ├── emailService.js
│   └── helpers.js
├── server.js
└── package.json
```

### Frontend:
```
frontend/
├── src/
│   ├── api/
│   │   └── axios.js
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── MemberDashboard.js
│   │   ├── AdminDashboard.js
│   │   ├── ExpenseForm.js
│   │   ├── ExpenseList.js
│   │   ├── ExpenseSummary.js
│   │   ├── PendingSignups.js
│   │   ├── MemberList.js
│   │   └── ProtectedRoute.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── hooks/
│   │   └── useAuth.js
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   └── Dashboard.js
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
```

## API Endpoints

### Authentication:
- `POST /api/auth/request-otp` - Request OTP for signup
- `POST /api/auth/verify-otp-signup` - Verify OTP and create account
- `POST /api/auth/login` - Login user
- `GET /api/auth/current-user` - Get current user (Protected)

### Members:
- `GET /api/members` - Get all members (Admin only)
- `POST /api/members/add` - Add new member (Admin only)
- `DELETE /api/members/:memberId` - Remove member (Admin only)
- `GET /api/members/:memberId` - Get member details

### Expenses:
- `POST /api/expenses/post` - Post new expense (Protected)
- `GET /api/expenses` - Get all expenses (Protected)
- `GET /api/expenses/user` - Get user's expenses (Protected)
- `GET /api/expenses/detail/:expenseId` - Get expense details (Protected)
- `POST /api/expenses/mark-paid` - Mark payment as paid (Protected)
- `GET /api/expenses/summary/user` - Get expense summary (Protected)

### Admin:
- `GET /api/admin/pending-signups` - Get pending signups (Admin only)
- `GET /api/admin/members` - Get all members (Admin only)
- `GET /api/admin/stats` - Get admin stats (Admin only)

## Workflow

### Member Signup:
1. User fills signup form with name, email, phone
2. System generates OTP and sends to email
3. Admin sees pending signup and copies OTP
4. Admin shares OTP with user via phone/message
5. User enters OTP and sets password
6. User account is created and verified

### Posting Expense:
1. Member fills expense form (product name, amount, description)
2. Member uploads invoice image
3. Member selects members to split expense with
4. System calculates individual shares
5. Expense is posted and visible to all selected members

### Payment Tracking:
1. Members can see shared expenses
2. Payer marks payment as complete
3. System tracks who has paid
4. Dashboard shows summary (spent, owed, balance)

## Environment Variables

### Backend (.env):
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key for authentication
- `ADMIN_EMAIL` - Admin email for notifications
- `ADMIN_PHONE` - Admin phone number
- `SMTP_HOST` - Email service host
- `SMTP_PORT` - Email service port
- `SMTP_USER` - Email username
- `SMTP_PASSWORD` - Email password

### Frontend (.env):
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000/api)

## Important Notes

1. **MongoDB**: Ensure MongoDB is installed and running
2. **Email Setup**: Configure Gmail SMTP or any other email service
3. **Admin Account**: Create admin account directly in database or add special signup flow
4. **JWT Secret**: Use a strong, random secret key
5. **Image Upload**: Currently uses base64 encoding; consider Cloudinary for production

## Default Accounts

To create an admin account for testing, add this directly to MongoDB:

```javascript
// Admin user document
{
  "name": "Admin",
  "email": "admin@room.com",
  "phone": "+91XXXXXXXXXX",
  "password": "bcrypt_hashed_password",
  "role": "admin",
  "isVerified": true
}
```

## Future Enhancements

- [ ] Payment proof upload
- [ ] SMS notifications
- [ ] Dashboard analytics
- [ ] Expense categories
- [ ] Recurring expenses
- [ ] File storage on cloud (Cloudinary)
- [ ] Mobile app
- [ ] Push notifications
- [ ] Export reports
- [ ] Multi-room support

## Troubleshooting

### Backend issues:
- Check MongoDB connection
- Verify JWT secret is set
- Check email configuration
- Ensure ports are available

### Frontend issues:
- Clear browser cache
- Check API URL configuration
- Verify backend is running
- Check browser console for errors

## License

MIT

## Support

For issues and questions, please contact the development team.
