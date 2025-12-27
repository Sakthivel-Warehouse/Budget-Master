# QUICK START GUIDE

## 🚀 Get Started in 5 Minutes

### Step 1: Backend Setup (Terminal 1)

```bash
cd backend
npm install
npm run dev
```

✅ Backend will run on `http://localhost:5000`

### Step 2: Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm start
```

✅ Frontend will open at `http://localhost:3000`

### Step 3: Configure Environment

Backend `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/room-admin
JWT_SECRET=change_this_to_random_key
ADMIN_EMAIL=admin@room.com
ADMIN_PHONE=+91XXXXXXXXXX
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password
NODE_ENV=development
```

### Step 4: Start MongoDB

Make sure MongoDB is running:
```bash
# Windows: Start MongoDB service
# Mac/Linux: brew services start mongodb-community
# Or use MongoDB Atlas cloud database
```

### Step 5: Test the App

1. Go to `http://localhost:3000`
2. Click "Sign up"
3. Enter details (name, email, phone)
4. Check email for OTP
5. Admin: Go to dashboard and copy OTP
6. Enter OTP and create password
7. Login and enjoy!

## 📊 Admin Account Setup

To create an admin account, insert this into MongoDB:

```javascript
db.users.insertOne({
  "name": "Admin",
  "email": "admin@room.com",
  "phone": "+91XXXXXXXXXX",
  "password": "$2a$10$...", // bcrypt hashed password
  "role": "admin",
  "isVerified": true,
  "createdAt": new Date()
})
```

Or create a member and manually update role to "admin" in database.

## 🎯 Main Features to Try

### For Members:
1. **Signup with OTP** - Request OTP, check email
2. **Post Expense** - Add expense with invoice image
3. **Split Bills** - Select members to split with
4. **Track Payments** - See who paid what
5. **View Summary** - Check your balance

### For Admin:
1. **Add Members** - Manually add team members
2. **Manage OTP** - View pending signups
3. **Share OTP** - Copy OTP for users
4. **Dashboard** - See stats and member list

## 🛠️ Troubleshooting

### Backend won't start?
- Check if port 5000 is free
- Verify MongoDB is running
- Check .env file syntax

### Frontend shows blank page?
- Check browser console (F12)
- Verify backend is running
- Clear cache and hard refresh (Ctrl+Shift+R)

### API calls failing?
- Check backend console for errors
- Verify API URL in frontend
- Check CORS headers

### Email not working?
- Verify SMTP credentials
- Check Gmail app password setup
- Look at backend logs

## 📝 API Testing with Curl

```bash
# Health check
curl http://localhost:5000/api/health

# Request OTP
curl -X POST http://localhost:5000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","phone":"+919999999999"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@room.com","password":"password"}'
```

## 🌐 Project URLs

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | http://localhost:3000 | React app |
| Backend | http://localhost:5000 | Express API |
| MongoDB | localhost:27017 | Database |
| Admin | /dashboard | After login |
| Member | /dashboard | After login |

## 🔐 Important Security Notes

1. Change `JWT_SECRET` in production
2. Use strong passwords
3. Enable HTTPS in production
4. Store sensitive data in environment variables
5. Validate all inputs
6. Use HTTPS for email credentials

## 📦 File Structure

```
room/
├── backend/
│   ├── models/        # Database schemas
│   ├── routes/        # API routes
│   ├── controllers/   # Business logic
│   ├── middleware/    # Auth middleware
│   ├── utils/         # Helper functions
│   ├── server.js      # Main entry
│   └── package.json
├── frontend/
│   ├── public/        # Static files
│   ├── src/           # React components
│   ├── package.json
│   └── tailwind.config.js
├── README.md
├── QUICK_START.md     # This file
├── BACKEND_SETUP.md
└── FRONTEND_SETUP.md
```

## 🎓 Learning Resources

- MongoDB Basics: https://docs.mongodb.com
- Express Guide: https://expressjs.com/en/
- React Documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com

## ✅ Checklist

- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] MongoDB running locally or cloud connection
- [ ] Gmail account configured for SMTP
- [ ] Both backend and frontend running
- [ ] Can access http://localhost:3000
- [ ] Can submit API requests to backend
- [ ] Environment variables configured

## 🤝 Need Help?

1. Check the README.md for detailed info
2. Review BACKEND_SETUP.md for server issues
3. Check FRONTEND_SETUP.md for UI issues
4. Look at browser console (F12) for errors
5. Check backend console for API errors

## 🚀 Next Steps After Setup

1. Create admin account
2. Add a few test members
3. Test expense posting
4. Try payment marking
5. Check dashboard stats
6. Explore admin features

## 💾 Database Models

### User
- name, email, phone, password, role, isVerified

### Expense
- productName, amount, description, invoiceImage, postedBy, splitWith[], status

### OTP
- name, email, phone, otp, isUsed

### Payment
- expenseId, fromUserId, toUserId, amount, status

---

**Happy Coding! 🎉**
