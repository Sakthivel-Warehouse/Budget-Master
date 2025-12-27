# Admin Account Setup Guide

## Option 1: Create via MongoDB Compass (GUI)

1. Install MongoDB Compass
2. Connect to your MongoDB instance
3. Navigate to `room-admin` database → `users` collection
4. Click "Add Data" → "Insert Document"
5. Copy and paste:

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

Note: Password is hashed for "admin123"

## Option 2: Create via MongoDB Shell

1. Open terminal where MongoDB is installed
2. Run: `mongosh`
3. Switch to database: `use room-admin`
4. Insert admin:

```javascript
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

## Option 3: Create via Backend Endpoint (After Setup)

Once backend is running:

```bash
# 1. Request OTP for admin
curl -X POST http://localhost:5000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@room.com",
    "phone": "+919999999999"
  }'

# 2. Verify OTP and signup
# (Get OTP from email/admin notification)
curl -X POST http://localhost:5000/api/auth/verify-otp-signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@room.com",
    "phone": "+919999999999",
    "otp": "123456",
    "password": "admin@123"
  }'

# 3. Update role to admin in database
# Use MongoDB to change role from "member" to "admin"
```

## Admin Login Credentials

After creating admin account:

**Email:** admin@room.com
**Password:** admin123

Or use your own password if you modified it.

## What You Can Do As Admin

✅ View all members
✅ Add new members manually
✅ Remove members
✅ View pending OTP signups
✅ Share OTPs with new users
✅ View dashboard statistics
✅ Manage expense summary

## Test Members Setup

You can also add test members directly:

```javascript
db.users.insertOne({
  name: "John Doe",
  email: "john@room.com",
  phone: "+919111111111",
  password: "$2a$10$X9.3Ljdc/K6pEKEKKR8gvOfQFQc6r2UX4OjK6LhQODp5hRv0Z6XmO",
  role: "member",
  isVerified: true,
  profileImage: null,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Change Admin Password

To change admin password:

1. Login to app as admin
2. Create new user account (it will be member)
3. Update the role to "admin" in database

Or use bcryptjs to generate new hash:

```bash
node
# In node
const bcryptjs = require('bcryptjs');
bcryptjs.hash('newpassword', 10).then(hash => console.log(hash));
```

Then update the password in database.

## Troubleshooting Admin Creation

**Problem:** Admin login fails
- Solution: Verify email and password in database
- Check role is set to "admin"
- Verify isVerified is true

**Problem:** Can't see admin panel
- Solution: Login with admin account
- Check user role is "admin" in database
- Clear browser cache and login again

**Problem:** OTP not showing in pending signups
- Solution: Check OTP collection in MongoDB
- Verify OTP not marked as isUsed
- Check if OTP is still valid (within 10 mins)

## Important Notes

- Password hash shown is for "admin123"
- Change it for production
- Use strong passwords
- Store credentials securely
- Change default email if needed
