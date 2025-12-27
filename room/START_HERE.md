# 🚀 START HERE - FIRST STEPS

Welcome! Follow these steps to get your application running.

---

## ⏱️ TIME ESTIMATE: 15 MINUTES

---

## STEP 1: VERIFY PREREQUISITES (2 minutes)

Before starting, make sure you have:

```bash
# Check Node.js
node --version
# Should show v14 or higher

# Check npm
npm --version
# Should show 6 or higher
```

✅ **If both work, proceed to Step 2**
❌ **If not, install Node.js from https://nodejs.org**

---

## STEP 2: SETUP MONGODB (3 minutes)

Choose one option:

### Option A: Local MongoDB
```bash
# Windows: Download from https://www.mongodb.com/try/download/community
# Mac: brew install mongodb-community
# Linux: Follow https://docs.mongodb.com/manual/installation/
```

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Copy connection string
5. Update MONGODB_URI in backend/.env

✅ **Proceed when MongoDB is ready**

---

## STEP 3: CONFIGURE BACKEND (3 minutes)

1. **Create .env file:**
```bash
cd backend
cp .env.example .env
```

2. **Edit backend/.env:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/room-admin
JWT_SECRET=your_super_secret_key_change_this
ADMIN_EMAIL=your_email@gmail.com
ADMIN_PHONE=+919999999999
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
NODE_ENV=development
```

**Email Setup (Gmail Example):**
1. Go to myaccount.google.com/security
2. Enable 2-Factor Authentication
3. Generate "App Password"
4. Use app password in SMTP_PASSWORD

✅ **.env configured**

---

## STEP 4: START BACKEND (2 minutes)

```bash
cd backend
npm install
npm run dev
```

**Expected output:**
```
MongoDB connected
Server running on port 5000
```

✅ **Backend running on http://localhost:5000**

---

## STEP 5: START FRONTEND (3 minutes)

**In a NEW terminal window:**

```bash
cd frontend
npm install
npm start
```

**This will automatically open:**
```
http://localhost:3000
```

✅ **Frontend running!**

---

## STEP 6: CREATE ADMIN ACCOUNT (2 minutes)

### Option A: Using MongoDB Compass (GUI - Easiest)

1. Download MongoDB Compass: https://www.mongodb.com/products/tools/compass
2. Connect to MongoDB
3. Go to: room-admin → users → Add Data → Insert Document
4. Paste this:

```json
{
  "name": "Admin",
  "email": "admin@room.com",
  "phone": "+919999999999",
  "password": "$2a$10$X9.3Ljdc/K6pEKEKKR8gvOfQFQc6r2UX4OjK6LhQODp5hRv0Z6XmO",
  "role": "admin",
  "isVerified": true,
  "profileImage": null,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

5. Click "Insert"

### Option B: Using MongoDB Shell

```bash
mongosh
use room-admin
db.users.insertOne({
  name: "Admin",
  email: "admin@room.com",
  phone: "+919999999999",
  password: "$2a$10$X9.3Ljdc/K6pEKEKKR8gvOfQFQc6r2UX4OjK6LhQODp5hRv0Z6XmO",
  role: "admin",
  isVerified: true,
  profileImage: null,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

✅ **Admin account created!**

---

## STEP 7: TEST THE APPLICATION (2 minutes)

1. Open http://localhost:3000
2. Click "Login"
3. Enter credentials:
   - Email: `admin@room.com`
   - Password: `admin123`
4. ✅ You should see admin dashboard!

---

## 🎉 YOU'RE DONE! YOU HAVE:

✅ Backend running on port 5000
✅ Frontend running on port 3000
✅ MongoDB connected
✅ Admin account ready
✅ Application fully functional

---

## 🎯 NEXT: TRY THESE FEATURES

### Test Member Signup:
1. Click "Sign up"
2. Fill in test details:
   - Name: John Doe
   - Email: john@test.com
   - Phone: +911234567890
3. Click "Request OTP"
4. Check email for OTP
5. Go to admin dashboard
6. Copy the OTP
7. Paste OTP in signup form
8. Create account with password

### Test Expense Posting:
1. Login as new member
2. Go to dashboard
3. Click "Post New Expense"
4. Fill expense details:
   - Product: Groceries
   - Amount: 1000
   - Add invoice image (any image file)
   - Select members to split with
5. Click "Post Expense"

### Test Admin Functions:
1. Login as admin (admin@room.com)
2. Go to admin dashboard
3. Try adding member manually
4. View pending signups
5. View member list

---

## 🆘 TROUBLESHOOTING

### Backend won't start?
```bash
# Check if port 5000 is free
# Kill process on port 5000

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

### MongoDB connection error?
- Make sure MongoDB is running
- Check connection string in .env
- Verify database name is correct

### Frontend shows blank page?
- Check browser console (F12)
- Verify backend is running
- Clear browser cache (Ctrl+Shift+Del)

### Can't login?
- Check admin account exists in MongoDB
- Verify email and password match
- Clear localStorage: Run in console:
  ```javascript
  localStorage.clear()
  ```

### Email not working?
- Check Gmail app password setup
- Verify SMTP credentials in .env
- Check backend logs for errors

---

## 📚 NEXT STEPS

After verifying everything works:

1. **Read Full Documentation:**
   - Open [README.md](./README.md)

2. **Understand Architecture:**
   - Read [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

3. **API Reference:**
   - Check [API_TESTING.md](./API_TESTING.md)

4. **Advanced Setup:**
   - [BACKEND_SETUP.md](./BACKEND_SETUP.md)
   - [FRONTEND_SETUP.md](./FRONTEND_SETUP.md)

5. **Deployment:**
   - See deployment sections in setup guides

---

## 💾 FILES READY TO USE

All your project files are in the `room/` directory:

```
room/
├── backend/       ← Your server code
├── frontend/      ← Your React app
└── Documentation/ ← All guides
```

---

## ⚠️ IMPORTANT REMINDERS

1. **Keep .env files secure** - Never commit to GitHub
2. **Change JWT_SECRET** - Use a strong random key
3. **Production settings** - See documentation for production setup
4. **Backups** - Backup your MongoDB data regularly
5. **Updates** - Update dependencies regularly for security

---

## ✅ FINAL CHECKLIST

- [ ] Node.js and npm installed
- [ ] MongoDB running
- [ ] Backend .env configured
- [ ] Backend started successfully
- [ ] Frontend installed
- [ ] Frontend running
- [ ] Admin account created
- [ ] Can login to app
- [ ] Admin dashboard visible
- [ ] Understood basic features

---

## 🎓 LEARNING TIPS

1. **Explore the UI** - Try all features
2. **Check browser console** - See network requests (F12)
3. **Look at API responses** - Understand data flow
4. **Try the admin panel** - Manage users
5. **Test error cases** - Try invalid inputs

---

## 🚀 READY TO BUILD?

Once everything is working:

1. Explore the code
2. Understand architecture
3. Add new features
4. Customize UI
5. Deploy to production

---

## 📞 WHERE TO GET HELP

- **Setup help:** [QUICK_START.md](./QUICK_START.md)
- **Backend help:** [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- **Frontend help:** [FRONTEND_SETUP.md](./FRONTEND_SETUP.md)
- **API help:** [API_TESTING.md](./API_TESTING.md)
- **All docs:** [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

---

## 🎉 YOU'RE READY!

**Time to start coding! Happy building! 🚀**

**Questions? Check the documentation index!**

---

**Last Updated:** November 2024
**Status:** Ready to Use ✅
