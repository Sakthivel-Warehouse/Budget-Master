# Backend Setup Instructions

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/room-admin
JWT_SECRET=super_secret_jwt_key_change_this
ADMIN_EMAIL=admin@example.com
ADMIN_PHONE=+91XXXXXXXXXX
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
NODE_ENV=development
```

### 3. Start MongoDB
Make sure MongoDB is running:
```bash
# Windows
mongod

# Mac/Linux
brew services start mongodb-community
```

### 4. Run Development Server
```bash
npm run dev
```

Server will start on `http://localhost:5000`

### 5. Test API
```bash
curl http://localhost:5000/api/health
```

## Project Structure

```
backend/
├── models/          # Mongoose schemas
├── routes/          # API routes
├── controllers/     # Business logic
├── middleware/      # Auth & validation
├── utils/           # Helper functions
├── server.js        # Entry point
└── package.json
```

## API Routes

### Auth Routes (`/api/auth`)
- `POST /request-otp` - Request OTP
- `POST /verify-otp-signup` - Verify OTP and signup
- `POST /login` - User login
- `GET /current-user` - Get current user (Protected)

### Members Routes (`/api/members`)
- `GET /` - Get all members (Admin)
- `POST /add` - Add member (Admin)
- `DELETE /:memberId` - Remove member (Admin)
- `GET /:memberId` - Get member details

### Expenses Routes (`/api/expenses`)
- `POST /post` - Post expense
- `GET /` - Get all expenses
- `GET /user` - Get user expenses
- `GET /detail/:expenseId` - Get expense details
- `POST /mark-paid` - Mark as paid
- `GET /summary/user` - Get summary

### Admin Routes (`/api/admin`)
- `GET /pending-signups` - Pending OTP signups
- `GET /members` - Get all members
- `GET /stats` - Dashboard stats

## Database Schema

### User
```
{
  name: String,
  email: String (unique),
  phone: String (unique),
  password: String (hashed),
  role: String (admin/member),
  isVerified: Boolean,
  profileImage: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Expense
```
{
  productName: String,
  amount: Number,
  description: String,
  invoiceImage: String (base64),
  postedBy: ObjectId (ref: User),
  splitWith: [{
    memberId: ObjectId,
    name: String,
    share: Number,
    isPaid: Boolean
  }],
  status: String (pending/partially_paid/settled),
  createdAt: Date,
  updatedAt: Date
}
```

### OTP
```
{
  email: String,
  phone: String,
  otp: String,
  name: String,
  isUsed: Boolean,
  createdAt: Date (expires in 10 mins)
}
```

## Email Configuration

### Using Gmail:
1. Enable "Less secure app access"
2. Or use Gmail App Password:
   - Enable 2FA
   - Generate app password
   - Use app password in SMTP_PASSWORD

### Other Email Services:
Update SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD accordingly

## Security Notes

- Change JWT_SECRET in production
- Use environment variables for all secrets
- Validate all inputs on backend
- Use HTTPS in production
- Add rate limiting
- Implement CORS properly
- Hash all passwords with bcryptjs

## Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# If not installed, install MongoDB Community
```

### Port Already in Use
```bash
# Change PORT in .env or use different port
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Email Not Sending
- Check SMTP credentials
- Verify email account is active
- Check firewall/security settings
- Look at console logs for errors

## Production Deployment

### Using Heroku:
```bash
# Create Heroku app
heroku create your-app-name

# Add MongoDB Atlas URI
heroku config:set MONGODB_URI=your_mongodb_atlas_uri

# Deploy
git push heroku main
```

### Using Railway/Render:
- Connect GitHub repo
- Set environment variables
- Deploy automatically

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Install specific package
npm install package-name

# Remove package
npm uninstall package-name
```

## Support & Documentation

- Mongoose: https://mongoosejs.com
- Express: https://expressjs.com
- JWT: https://jwt.io
- Nodemailer: https://nodemailer.com
