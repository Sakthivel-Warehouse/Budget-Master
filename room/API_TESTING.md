# API Testing Guide

## Using Postman

1. Install Postman from https://www.postman.com/downloads/
2. Import this collection or create requests manually
3. Set base URL: `http://localhost:5000/api`

## Authentication

After login/signup, copy the token from response and add to headers:
```
Authorization: Bearer <token>
```

---

## AUTH ENDPOINTS

### 1. Request OTP
**POST** `/auth/request-otp`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919999999999"
}
```

**Response:**
```json
{
  "message": "OTP sent to your email",
  "success": true
}
```

---

### 2. Verify OTP & Signup
**POST** `/auth/verify-otp-signup`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919999999999",
  "otp": "123456",
  "password": "Password@123"
}
```

**Response:**
```json
{
  "message": "Signup successful",
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "650abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919999999999",
    "role": "member"
  }
}
```

---

### 3. Login
**POST** `/auth/login`

```json
{
  "email": "john@example.com",
  "password": "Password@123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "650abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919999999999",
    "role": "member"
  }
}
```

---

### 4. Get Current User
**GET** `/auth/current-user`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "650abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919999999999",
    "role": "member",
    "isVerified": true,
    "createdAt": "2023-09-15T10:30:00Z"
  }
}
```

---

## MEMBER ENDPOINTS

### 1. Get All Members (Admin Only)
**GET** `/members`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "members": [
    {
      "_id": "650abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+919999999999",
      "role": "member"
    }
  ]
}
```

---

### 2. Add Member (Admin Only)
**POST** `/members/add`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+918888888888"
}
```

**Response:**
```json
{
  "message": "Member added successfully",
  "success": true,
  "member": {
    "id": "650abc124...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+918888888888",
    "role": "member"
  }
}
```

---

### 3. Remove Member (Admin Only)
**DELETE** `/members/:memberId`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "message": "Member removed successfully",
  "success": true
}
```

---

### 4. Get Member Details
**GET** `/members/:memberId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "member": {
    "_id": "650abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919999999999"
  }
}
```

---

## EXPENSE ENDPOINTS

### 1. Post Expense
**POST** `/expenses/post`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "productName": "Groceries",
  "amount": 1500,
  "description": "Weekly groceries from market",
  "invoiceImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
  "splitWith": [
    {
      "memberId": "650abc123...",
      "name": "John Doe"
    },
    {
      "memberId": "650abc124...",
      "name": "Jane Doe"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Expense posted successfully",
  "success": true,
  "expense": {
    "_id": "650abc125...",
    "productName": "Groceries",
    "amount": 1500,
    "postedBy": "650abc123...",
    "splitWith": [
      {
        "memberId": "650abc123...",
        "name": "John Doe",
        "share": 750,
        "isPaid": false
      },
      {
        "memberId": "650abc124...",
        "name": "Jane Doe",
        "share": 750,
        "isPaid": false
      }
    ],
    "status": "pending"
  }
}
```

---

### 2. Get All Expenses
**GET** `/expenses`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "expenses": [
    {
      "_id": "650abc125...",
      "productName": "Groceries",
      "amount": 1500,
      "status": "pending"
    }
  ]
}
```

---

### 3. Get User Expenses
**GET** `/expenses/user`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "postedExpenses": [...],
  "sharedExpenses": [...]
}
```

---

### 4. Get Expense Details
**GET** `/expenses/detail/:expenseId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "expense": {
    "_id": "650abc125...",
    "productName": "Groceries",
    "amount": 1500,
    "description": "Weekly groceries",
    "invoiceImage": "data:image/jpeg;base64,...",
    "postedBy": {
      "_id": "650abc123...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "splitWith": [...],
    "status": "pending"
  }
}
```

---

### 5. Mark as Paid
**POST** `/expenses/mark-paid`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "expenseId": "650abc125...",
  "memberId": "650abc123..."
}
```

**Response:**
```json
{
  "message": "Payment marked as paid",
  "success": true,
  "expense": {
    "_id": "650abc125...",
    "status": "partially_paid",
    "splitWith": [
      {
        "memberId": "650abc123...",
        "isPaid": true
      }
    ]
  }
}
```

---

### 6. Get Expense Summary
**GET** `/expenses/summary/user`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "totalSpent": 2500,
    "totalOwed": 1000,
    "balance": 1500
  }
}
```

---

## ADMIN ENDPOINTS

### 1. Get Pending Signups
**GET** `/admin/pending-signups`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "pendingSignups": [
    {
      "_id": "650abc126...",
      "name": "Bob Smith",
      "email": "bob@example.com",
      "phone": "+917777777777",
      "otp": "456789",
      "isUsed": false,
      "createdAt": "2023-09-15T11:00:00Z"
    }
  ]
}
```

---

### 2. Get All Members
**GET** `/admin/members`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "members": [
    {
      "_id": "650abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+919999999999",
      "role": "member"
    }
  ]
}
```

---

### 3. Get Admin Stats
**GET** `/admin/stats`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalMembers": 5,
    "pendingSignups": 2
  }
}
```

---

## CURL EXAMPLES

### Request OTP
```bash
curl -X POST http://localhost:5000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919999999999"
  }'
```

### Verify OTP & Signup
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp-signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919999999999",
    "otp": "123456",
    "password": "Password@123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password@123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/current-user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get All Members (Admin)
```bash
curl -X GET http://localhost:5000/api/members \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Add Member (Admin)
```bash
curl -X POST http://localhost:5000/api/members/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+918888888888"
  }'
```

### Post Expense
```bash
curl -X POST http://localhost:5000/api/expenses/post \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "productName": "Groceries",
    "amount": 1500,
    "description": "Weekly groceries",
    "invoiceImage": "data:image/jpeg;base64,...",
    "splitWith": [
      {"memberId": "ID1", "name": "John Doe"},
      {"memberId": "ID2", "name": "Jane Doe"}
    ]
  }'
```

### Mark Payment as Paid
```bash
curl -X POST http://localhost:5000/api/expenses/mark-paid \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "expenseId": "EXPENSE_ID",
    "memberId": "MEMBER_ID"
  }'
```

### Get Pending Signups (Admin)
```bash
curl -X GET http://localhost:5000/api/admin/pending-signups \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Get Admin Stats (Admin)
```bash
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Error Responses

### Unauthorized (401)
```json
{
  "message": "No token provided"
}
```

### Forbidden (403)
```json
{
  "message": "Admin access required"
}
```

### Not Found (404)
```json
{
  "message": "User not found"
}
```

### Bad Request (400)
```json
{
  "message": "All fields are required"
}
```

### Conflict (409)
```json
{
  "message": "User already exists"
}
```

---

## Testing Checklist

- [ ] Request OTP successfully
- [ ] Receive OTP in email
- [ ] Verify OTP and create account
- [ ] Login with credentials
- [ ] Get current user info
- [ ] Post expense (as member)
- [ ] Upload invoice image
- [ ] Mark payment as paid
- [ ] Get expense summary
- [ ] Add member (as admin)
- [ ] Remove member (as admin)
- [ ] View pending signups (as admin)
- [ ] Get admin stats
- [ ] Verify role-based access control

---

Happy Testing! 🧪
